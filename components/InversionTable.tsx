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

    const tableStyle = {
      width: '100%',
      borderCollapse: 'collapse',  // Ensures borders between cells are merged
    };

    const cellStyle = {
        border: '1px solid black',  // Adds a border around each cell
        padding: '8px',  // Adds padding inside each cell for better readability
        textAlign: 'center',  // Centers the text inside cells
    };

    return (
      <table style={tableStyle}>
          <thead>
              <tr>
                  <th style={cellStyle}>Last Inversion Date</th>
                  <th style={cellStyle}>Days Since Last Inversion</th>
                  <th style={cellStyle}>Contango % 3M-10Y</th>
                  <th style={cellStyle}>Difference 3M-10Y</th>
                  <th style={cellStyle}>Contango % 2Y-10Y</th>
                  <th style={cellStyle}>Difference 2Y-10Y</th>
              </tr>
          </thead>
          <tbody>
              {data.map((item, index) => (
                  <tr key={index}>
                      <td style={cellStyle}>{item.last_inversion_date.value}</td>
                      <td style={cellStyle}>{item.num_days_since_last_inversion}</td>
                      <td style={cellStyle}>{item.contango_3m_10y}</td>
                      <td style={cellStyle}>{item.diff_3m_10y}</td>
                      <td style={cellStyle}>{item.contango_2y_10y}</td>
                      <td style={cellStyle}>{item.diff_2y_10y}</td>
                  </tr>
              ))}
          </tbody>
      </table>
  );
};

export default InversionTable;

