import argparse
import os
from  dotenv import load_dotenv
import pandas as pd 
from datetime import datetime

from gpt_researcher import GPTResearcher
import re

import yc_central
from yc_central.historical import HistoricalFredDataAPI

import utils.get_daily_discription as get_daily_discription
import utils.get_news_articles as get_news_articles 

# assert load_dotenv()

CURRENT_DATE = get_daily_discription.clean_date(datetime.today())
DATA_CLEANED_DIR = "./data/cleaned/yield_curve_historical_rates_MASTER.parquet"


if __name__ == "__main__": 

    parser = argparse.ArgumentParser(description = "Get API key for processing news articles.")
    parser.add_argument('--api_key', type=str, required=True, help='API key to access the service')
    args = parser.parse_args()
    api_key = args.api_key

    # generate insights only if its a trading day 
    if get_daily_discription.is_trading_day(): 

        # get intermediate data to pass into prompt 
        yc_data = pd.read_parquet(DATA_CLEANED_DIR)
        summary_str = get_daily_discription.summary_data_str(DATA_CLEANED_DIR)
        spy_data = get_daily_discription.get_historical_market_data() 

        # fetch today's relevant news articles and their citations 
        data = get_news_articles.get_alphavantage_articles(api_key)
        top_k_articles = get_news_articles.get_top_k_relevant_articles(data, 3) 
        article_summaries = get_news_articles.get_top_k_summaries(top_k_articles)
        citations = get_news_articles.get_top_k_citations(top_k_articles)

        # create prompt for generating daily insights 
        prompt = get_daily_discription.get_prompt(
            date = CURRENT_DATE, 
            summary_data = summary_str, 
            historical_yc = yc_data.iloc[: 31].to_string(index = False), 
            historical_spy = spy_data.to_string(index = False),
            article_summaries = article_summaries
        )

        # temp_insights = get_daily_discription.generate_insight(prompt)
        # insights = f"\n{temp_insights}\n\n"
        api = HistoricalFredDataAPI(fred_api_key=os.environ["FRED_API_KEY"])
        historical_data = api.get_all_yield_series()

        import yc_central.analysis

        inversion_2_10 = yc_central.analysis.calculate_yield_inversion(df=historical_data, short_term="DGS2", long_term="DGS10")
        inversion_3mo_10 = yc_central.analysis.calculate_yield_inversion(df=historical_data, short_term="DGS3MO", long_term="DGS10")

        is_inverted_2_10 = inversion_2_10.iloc[-1]["DGS10-DGS2_Inversion"]
        is_inverted_3mo_10 = inversion_3mo_10.iloc[-1]["DGS10-DGS3MO_Inversion"]

        inversion_status_2_10 = f"Is the 2Y, 10Y spread currently inverted: {True if is_inverted_2_10 else False}."
        inversion_status_3mo_10 = f"Is the 3 month, 10Y spread currently inverted: {True if is_inverted_3mo_10 else False}."

        inversion_status_str = inversion_status_2_10 + " " + inversion_status_3mo_10

        query = f"""

            You are an expert on the US Treasury Yield Curve that contributes daily articles to an online publication. The user will provide you with your last 5 descriptions about the yield curve and current state of monetary policy. 

            Market's are closed today, so instead of generating a unique insight, you will summarize your analyses from the past 5 days and list in bullet points the biggest unanswered questions for the week ahead regarding markets and monetary policy.
                            
            Your main goals as a commentator are to:
                1.	Inform the reader about current market conditions in the context of user-provided summary data on the economy.
                2.	Interpret what these developments may mean for future Federal Reserve monetary policy.
                            
            Your commentary should be optimized for SEO for a macroeconomic publication. Ensure your analysis is intelligent, non-speculative, and free of financial advice. It should be easily understood by an 8th grader but compelling for a professional investor. Use the active voice. 
            Do not include section headers or separators. Output should be in paragraph form.

            Keep in mind the following regarding the yield curve inversion status: {inversion_status_str}

        """
        researcher = GPTResearcher(query=query, report_type="research_report")
        researcher.set_verbose(False)

        research_result = await researcher.conduct_research()
        report = await researcher.write_report()
        report = re.sub("#", "", report)
        report = re.sub("```markdown", "", report)
        temp_insights = re.sub("```", "", report)

        temp_tldr = get_daily_discription.generate_tldr(temp_insights)
        tldr = f"\n**TL;DR**\n\n{temp_tldr}\n"
        
    else: 
        desc = get_daily_discription.format_prev_descriptions() 
        insights = f"\nThe following is a summary of the past week's Yield Curve movements."
        insights += "\n\n" + get_daily_discription.generate_reflection(desc)
        tldr = "\nMarkets are closed today. Values displayed are from last trading day."
        citations = ""

    get_daily_discription.push_to_big_query(
        {
            "Date": CURRENT_DATE, 
            "Description": insights
        },
        table_id = 'daily_description'
    ) 
    get_daily_discription.push_to_big_query(
        {
            "Date": CURRENT_DATE, 
            "TLDR": tldr
        },
        table_id = 'tldr'
    )
    get_daily_discription.push_to_big_query(
        {
            "Date": CURRENT_DATE, 
            "Citations": citations
        },
        table_id = 'citations'
    )