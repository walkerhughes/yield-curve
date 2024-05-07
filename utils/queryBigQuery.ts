// utils/queryBigQuery.ts

import { BigQuery } from '@google-cloud/bigquery';
import { createBigQueryClient } from './bigquery';

export async function queryBigQuery(sqlQuery: string): Promise<any[]> {
    // init client and make request to google bigquery 
    const client = createBigQueryClient();
    const [job] = await client.createQueryJob({ query: sqlQuery });
    const [rows] = await job.getQueryResults();
    return rows;
}
