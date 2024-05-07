// utils/bigquery.ts

import { BigQuery } from '@google-cloud/bigquery';

// Function to create a BigQuery client
export function createBigQueryClient() {
    const credentialsJSON = process.env.BIGQUERY_CREDENTIALS_PATH;
    const credentials = JSON.parse(credentialsJSON);

    if (!credentials) {
        throw new Error("The path to the BigQuery credentials is not set in the environment variables.");
    }

    const bigQueryClient = new BigQuery({
        keyFilename: credentials,
    });

    return bigQueryClient;
}
