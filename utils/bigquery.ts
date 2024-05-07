// utils/bigquery.ts

import { BigQuery } from '@google-cloud/bigquery';

// Function to create a BigQuery client
export function createBigQueryClient() {
    const credentialsPath = process.env.BIGQUERY_CREDENTIALS_PATH;
    if (!credentialsPath) {
        throw new Error("The path to the BigQuery credentials is not set in the environment variables.");
    }

    const bigQueryClient = new BigQuery({
        keyFilename: credentialsPath,
    });

    return bigQueryClient;
}
