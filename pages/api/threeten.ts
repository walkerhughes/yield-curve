// pages/api/threeten.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { queryBigQuery } from '../../utils/queryBigQuery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const sqlQuery = 
    'SELECT * \
     FROM ( \
            SELECT \
                Date, \
                `3_Mo` - `10_Yr` AS CONTANGO_PCT_3m_10, \
            FROM \
                `yieldcurve-422317.yieldcurve.historical` \
            ORDER BY \
                Date DESC\
            LIMIT 365\
    ) \
    ORDER BY Date';

    try {
        const results = await queryBigQuery(sqlQuery);
        res.status(200).json(results);
    } catch (error) {
        console.error("Failed to query BigQuery", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message});
    }
}