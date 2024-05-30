import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const TableMarkdownComponent: React.FC = () => {
  const [data, setData] = useState<{ today: string; last_inversion_date: string; num_days_since_last_inversion: number; contango_3m_10y: number; diff_3m_10y: number; contango_2y_10y: number; diff_2y_10y: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/summarystats');
        const result = await response.json();
        setData(result[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const tableString = `
  | Current Date    | Last Inversion Date   | Days Inverted    | 3 Month - 10 Year Difference    | 2 Year - 10 Year Difference    |
  |-------------|-------------|-------------|-------------|-------------|
  | ${data.today} | ${data.last_inversion_date} | ${data.num_days_since_last_inversion} | ${data.diff_3m_10y}% | ${data.diff_2y_10y}% |
  `;

  return (
    <div className="center-table">
      <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-table">{tableString}</ReactMarkdown>
    </div>
  );
};

export default TableMarkdownComponent;



