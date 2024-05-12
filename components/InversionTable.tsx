// components/InversionTable.tsx
import React, { useEffect, useState } from 'react';
import { InversionData } from '../interfaces/InversionData';

const InversionTable: React.FC = () => {
    const [data, setData] = useState<InversionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/table');
                if (!response.ok) throw new Error('Network response was not ok');
                const jsonData: InversionData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, []);  // The empty array ensures this effect runs only once after the component mounts

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No data available.</p>;

    return (
      <table>
          <thead>
              <tr>
                  <th>Last Inversion Date</th>
                  <th>Days Since Last Inversion</th>
                  <th>Contango 3M-10Y</th>
                  <th>Diff 3M-10Y</th>
                  <th>Contango 2Y-10Y</th>
                  <th>Diff 2Y-10Y</th>
              </tr>
          </thead>
          <tbody>
              {data.map((item, index) => (
                  <tr key={index}>
                      <td>{item.last_inversion_date.value}</td>
                      <td>{item.num_days_since_last_inversion}</td>
                      <td>{item.contango_3m_10y}</td>
                      <td>{item.diff_3m_10y}</td>
                      <td>{item.contango_2y_10y}</td>
                      <td>{item.diff_2y_10y}</td>
                  </tr>
              ))}
          </tbody>
      </table>
  );
};

export default InversionTable;

