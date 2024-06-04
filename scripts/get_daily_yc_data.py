import os 
import json 
import pandas as pd 
from google.cloud import bigquery

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath("yieldcurve-422317-510529e47525.json")

def query_bigquery_and_save_to_json(table, destination_file):

    query = f"""
        SELECT 
            *
        FROM 
            {table}
        ORDER BY 
            Date DESC
        LIMIT 1;
    """

    try: 
        # Initialize the BigQuery client
        client = bigquery.Client()
        # Run the query
        query_job = client.query(query)
        # Convert the result to a Pandas DataFrame
        df = query_job.to_dataframe()
        # Convert the DataFrame to a JSON object
        json_data = df.to_dict(orient='records')

        if table == "yieldcurve.historical": 
            # Delete unused keys 
            del json_data[0]["2_Yr___10_Yr"]
            del json_data[0]["2_Yr___30_Yr"]
            del json_data[0]["10_Yr___30_Yr"]

        # Save the JSON object to a file
        with open(destination_file, 'w', encoding='utf-8') as json_file:
            json.dump(json_data[0], json_file, ensure_ascii=False, indent=4)
        print(f"Data saved to {destination_file}")
    except: 
        raise ValueError("Unable to retrieve and save data.")


if __name__ == "__main__":
    
    # fetch data from BigQuery and save the results to local json files
    query_bigquery_and_save_to_json(table = "yieldcurve.historical", destination_file = "./data/daily_data.json")
    query_bigquery_and_save_to_json(table = "yieldcurve.tldr", destination_file = "./data/daily_tldr.json")
    query_bigquery_and_save_to_json(table = "yieldcurve.daily_description", destination_file = "./data/daily_description.json")
    query_bigquery_and_save_to_json(table = "yieldcurve.citations", destination_file = "./data/daily_citations.json")