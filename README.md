## [YieldCurveCentral.com](https://www.yieldcurvecentral.com/): Daily Yield Curve Insights Brought to you by GPT-4o

This project brings digestible, daily macroeconomic analyses of the most current yield curve interest rate dynamics to your fingertips. Yield Curve Central leverages a data ingestion pipeline automated with GitHub Actions to process data from various sources each day, including data scraped from Treasury.gov and obtained through the Yahoo Finance and AlphaVantage APIs. This data is passed to GPT-4o, which generates bespoke analyses displayed on a web page deployed on Vercel and built with TypeScript and Next.js.

## Features
**Daily Updates**: EOD data scraped directly from treasury.gov and pushed to Google BigQuery via GitHub Actions Workflow each day. The most relevant publicly available news articles published about macroeconomics and monetary policy are ingested via the AlphaVantage API, along with equity index data from Yahoo Finance.

**Insights**: Generates insights on the most up-to-date yield curve dynamics with GPT-4o. The model assumes the personality of a macroeconomic expert keen on educating the reader about monetary policy, accomplished via efficient system-level prompting. Daily data is fed to the model via the user prompt, and includes: 
1. Daily and historical yield curve values
2. Yield curve summary statistics, including if the yield curve is inverted, inversion duration, and magnitude of inversion 
3. Daily and historical SPY ETF values to indicate dynamics of equity markets from the Yahoo Finance API 
4. News article summaries from publicly available publications obtained from the AlphaVantage API 

**Automated Workflow**: GitHub Actions efficiently automates daily scraping, data processing, insight generation, pushing to Google BigQuery, and publishing on YieldCurveCentral.com.

**Interactive and Educational**: Learning resources on how to use the Yield Curve also available @ [YieldCurveCentral.com](https://www.yieldcurvecentral.com/).


