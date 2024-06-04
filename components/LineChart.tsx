import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, Point } from 'chart.js';
import jsonData from '../data/daily_data.json';

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

const LineChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<"line", (number | Point)[], unknown>>({
    labels: [],
    datasets: []
  });

  const options = {
    plugins: {
      legend: {
        display: true // This can be set to false if you don't want to display the legend
      },
      title: {
        display: true,
        text: 'The Yield Curve' // You can set the chart title here
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tenure' // Set the x-axis label here
        }
      },
      y: {
        title: {
          display: true,
          text: 'Yield %' // Set the y-axis label here
        }
      }
    }
  };

  useEffect(() => {
    const data = jsonData;
    const excludeKeys = new Set(['Date']);
    const labels = Object.keys(data).filter(key => !excludeKeys.has(key));
    const dataset = {
      label: `EOD Value on ${data.Date}`,
      data: labels.map(label => data[label]),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    };

    // Parse the JSON data directly
    setChartData({
        labels: labels.map(label => label.replace('_', ' ').replace('Mo', ' Month').replace('Yr', ' Year')),
        datasets: [dataset]
      });
  }, []);

  return <Line data={chartData} options={options} />;
};

export default LineChart;