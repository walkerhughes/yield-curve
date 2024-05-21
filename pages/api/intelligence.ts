// pages/api/intelligence.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { queryBigQuery } from '../../utils/queryBigQuery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const sqlQuery = 
    'SELECT \
        Description \
    FROM \
        `yieldcurve-422317.yieldcurve.daily_description` \
    ORDER BY \
        Date DESC \
    LIMIT 1';

    try {
        const results = await queryBigQuery(sqlQuery);
        res.status(200).json(results);
    } catch (error) {
        console.error("Failed to query BigQuery", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message});
    }
}