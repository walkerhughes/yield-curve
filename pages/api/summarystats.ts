import type { NextApiRequest, NextApiResponse } from 'next';
import { queryBigQuery } from '../../utils/queryBigQuery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const sqlQuery = 
    'WITH inversion_date AS ( \
        SELECT  \
          MAX(CAST(Date AS DATE)) AS last_inversion_date \
        FROM  \
          `yieldcurve-422317.yieldcurve.historical`  \
        WHERE  \
          `2_Yr` < `10_Yr` \
      ), \
      contango_data AS ( \
        SELECT  \
          Date, `3_Mo`, `10_Yr`, `2_Yr` \
        FROM  \
          `yieldcurve-422317.yieldcurve.historical` \
        ORDER BY  \
          Date DESC  \
        LIMIT 1 \
      ) \
      SELECT  \
        CAST(CAST(Date AS DATE) AS STRING) AS today, \
        CAST(id.last_inversion_date + 1 AS STRING) AS last_inversion_date, \
        DATE_DIFF(CURRENT_DATE(), id.last_inversion_date, DAY) + 1 AS num_days_since_last_inversion, \
        ROUND(cd.`3_Mo` - cd.`10_Yr`, 2) AS diff_3m_10y, \
        ROUND(cd.`2_Yr` - cd.`10_Yr`, 2) AS diff_2y_10y \
      FROM  \
        inversion_date id, contango_data cd';

    try {
        const results = await queryBigQuery(sqlQuery);
        res.status(200).json(results);
    } catch (error) {
        console.error("Failed to query BigQuery", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message});
    }
}
