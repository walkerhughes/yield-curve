import os
import pytz
from datetime import datetime, timedelta

from langchain import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import YoutubeLoader

from googleapiclient.discovery import build
from google.cloud import bigquery

import dotenv
dotenv.load_dotenv()

TODAY = datetime.now(pytz.utc).date()
TODAY_STR = TODAY.strftime("%B %d, %Y")

API_KEY = os.environ["YOUTUBE_API_KEY"]
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

PLAYLISTS = {
    'PLIyiGQywEp66lKvfhiDbiuZnCboYneuX2': [f"Goldman Sachs, accessed via YouTube on {TODAY_STR}", 7], 
    'PLy6i5dkCTFUKoV7LpW8mnFIVDOSAomy01': [f"EPB Macro Research, accessed via YouTube on {TODAY_STR}", 5], 
}


def push_to_big_query(data, table_id = 'daily_yt_summaries'):
    # init client 
    client = bigquery.Client()

    # Define your dataset and table
    dataset_id = 'yieldcurve'

    table_ref = client.dataset(dataset_id).table(table_id)
    # Insert data into the table
    to_insert = [
        data
    ]
    errors = client.insert_rows_json(table_ref, to_insert)  # Make an API request.
    if errors == []:
        print("New rows have been added.")
    else:
        print("Encountered errors while inserting rows: {}".format(errors))


def summarize_transcript(transcript):

    # initialize gpt-4o-mini
    chat_openai = ChatOpenAI(
        model = "gpt-4o-mini",
        temperature = 0.5
    )

    # init the prompt template for chat completion 
    prompt_template = PromptTemplate(
        input_variables = ["transcript"],
        template = """
            You are a macroeconomic analyst. Create a brief TL;DR of the following transcript and highlight the most important insights.
            
            Include no more than 5 bullets, and focus on how this will affect markets looking forward. Pay attention to any important dates mentioned:\n\n{transcript}

            Example:

            <give brief description of the transcript here. no more than 2-3 sentences.>

            1. <first important point goes here>
            2. <second important point goes here>
            .
            .
            .
            5. <last important point goes here>
        """
    )

    # Create a LangChain LLMChain
    llm_chain = LLMChain(
        llm = chat_openai,
        prompt = prompt_template
    )

    # Generate the summary
    summary = llm_chain.run({"transcript": transcript})
    return summary

def get_youtube_service(api_key):
    return build('youtube', 'v3', developerKey=api_key)

def get_playlist_items(service, playlist_id):
    playlist_items = []
    request = service.playlistItems().list(
        part = 'snippet',
        playlistId = playlist_id,
        maxResults = 50
    )
    while request:
        response = request.execute()
        playlist_items.extend(response['items'])
        request = service.playlistItems().list_next(request, response)
    return playlist_items

def get_videos_from_last_n_days(items, n):
    today = datetime.now(pytz.utc).date()
    start_date = today - timedelta(days=n)
    recent_videos = []
    for item in items:
        video_date = item['snippet']['publishedAt'][:10]  # Extract date
        video_date = datetime.strptime(video_date, '%Y-%m-%d').date()
        if start_date <= video_date <= today:
            title = item['snippet']['title']
            video_id = item['snippet']['resourceId']['videoId']
            url = f'https://www.youtube.com/watch?v={video_id}'
            recent_videos.append((title, url, video_id))
    return recent_videos


def main(playlist_id, n_days = 5):

    service = get_youtube_service(API_KEY)
    items = get_playlist_items(service, playlist_id)
    videos = get_videos_from_last_n_days(items, n_days)

    summaries = []

    if videos:
        print(f"Videos added in the last {n_days} days ({datetime.now().date()}):")
        for title, url, video_id in videos:
            print(f"Title: {title}\nURL: {url}\n")
            try:
                # Initialize YoutubeLoader with video_url
                transcript_loader = YoutubeLoader.from_youtube_url(
                    url,
                    add_video_info = True,
                    language = ["en", "en-US"],
                    translation = "en"
                )
                documents = transcript_loader.load()
                if documents:
                    # Extract transcript text from documents
                    transcript_text = ' '.join([doc.page_content for doc in documents])
                    summary = summarize_transcript(transcript_text)
                    citation = f"'{title}.' {PLAYLISTS[playlist_id][0]}. [Watch here.]({url})"
                    final_summary = {"citation": citation, "summary": f"\n{summary}\n"}
                    summaries.append(final_summary)

                    push_to_big_query({
                        "Date": TODAY_STR, 
                        "Summary": summary, 
                        "Citation": citation
                    }, table_id = 'daily_yt_summaries')

                else:
                    print(f"No transcript available for video '{title}'.\n")

            except Exception as e:
                print(f"Error fetching transcript for video '{title}': {e}")

        return summaries

    else:
        print(f"No videos added in the last {n_days} days.")


if __name__ == '__main__':

    for playlist in PLAYLISTS:
        try:
            z = main(playlist, n_days = PLAYLISTS[playlist][1])
        except:
            continue