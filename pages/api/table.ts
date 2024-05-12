// pages/api/table.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { queryBigQuery } from '../../utils/queryBigQuery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const sqlQuery = 
    'WITH inversion_date AS ( \
        SELECT \
          MAX(CAST(Date AS DATE)) AS last_inversion_date \
        FROM \
          `yieldcurve-422317.yieldcurve.historical` \
        WHERE \
          `2_Yr` < `10_Yr` \
      ), \
      contango_data AS ( \
        SELECT \
          * \
        FROM \
          `yieldcurve-422317.yieldcurve.historical` \
        ORDER BY \
          Date DESC \
        LIMIT 1 \
      ) \
      SELECT \
        (SELECT last_inversion_date FROM inversion_date) AS last_inversion_date, \
        (SELECT DATE_DIFF(CURRENT_DATE(), last_inversion_date, DAY) FROM inversion_date) AS num_days_since_last_inversion, \
        (SELECT ROUND(100 * (`3_Mo` - `10_Yr`) / `3_Mo`, 2) FROM contango_data) AS contango_3m_10y, \
        (SELECT ROUND(`3_Mo` - `10_Yr`, 2) FROM contango_data) AS diff_3m_10y, \
        (SELECT ROUND(100 * (`2_Yr` - `10_Yr`) / `2_Yr`, 2) FROM contango_data) AS contango_2y_10y, \
        (SELECT ROUND(`2_Yr___10_Yr`, 2) FROM contango_data) AS diff_2y_10y';

    try {
        const results = await queryBigQuery(sqlQuery);
        res.status(200).json(results);
    } catch (error) {
        console.error("Failed to query BigQuery", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message});
    }
}