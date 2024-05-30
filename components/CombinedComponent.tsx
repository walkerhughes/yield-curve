import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, Point } from 'chart.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Register the necessary components for Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CombinedComponent: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<"line", (number | Point)[], unknown>>({
    labels: [],
    datasets: []
  });

  const [tableData, setTableData] = useState<{
    today: string;
    last_inversion_date: string;
    num_days_since_last_inversion: number;
    diff_3m_10y: number;
    diff_2y_10y: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/data');
        const rawData = await response.json();

        if (rawData.length === 0) {
          return;
        }

        const data = rawData[0];

        const excludeKeys = new Set(['Date', '2_Yr___10_Yr', '2_Yr___30_Yr', '10_Yr___30_Yr']);
        const labels = Object.keys(data).filter(key => !excludeKeys.has(key));

        const dataset = {
          label: `EOD Value on ${data.Date}`,
          data: labels.map(label => data[label]),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        };

        setChartData({
          labels: labels.map(label => label.replace('_', ' ').replace('Mo', ' Month').replace('Yr', ' Year')),
          datasets: [dataset]
        });

      } catch (error) {
        console.error("Error fetching chart data: ", error);
        setError("Error fetching chart data");
      }
    };

    const fetchTableData = async () => {
      try {
        const response = await fetch('/api/summarystats');
        const result = await response.json();
        setTableData(result[0]);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setError("Error fetching table data");
      }
    };

    fetchChartData();
    fetchTableData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chartData || !tableData) {
    return (
      <div className="center-table">
        <div className="spinner"></div>
      </div>
    ); // Render spinner while loading
  }

  const tableString = `
  | Current Date    | Last Inversion Date   | Days Inverted    | 3 Month - 10 Year Difference    | 2 Year - 10 Year Difference    |
  |-------------|-------------|-------------|-------------|-------------|
  | ${tableData.today} | ${tableData.last_inversion_date} | ${tableData.num_days_since_last_inversion} | ${tableData.diff_3m_10y}% | ${tableData.diff_2y_10y}% |
  `;

  const lineChartOptions = {
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: 'The Yield Curve'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tenure'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Yield %'
        }
      }
    }
  };

  return (
    <div>
      <div>
        <Line data={chartData} options={lineChartOptions} />
      </div>
      <div className="center-table">
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-table">{tableString}</ReactMarkdown>
      </div>
    </div>
  );
};

export default CombinedComponent;

