// components/LineChart.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ChartData, Point } from 'chart.js';

// Register the necessary components for Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const LineChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<"line", (number | Point)[], unknown>>({
    labels: [], // This will hold the time spans, e.g., "1 Mo", "2 Mo", etc.
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const rawData = await response.json();
        console.log("Fetched Data:", rawData); // Check the structure here

        if (rawData.length === 0) {
          return; // Early exit if no data is available
        }

        const data = rawData[0]; // Assuming the first item contains the data

        // Define keys to exclude and the labels array for the x-axis
        const excludeKeys = new Set(['Date', '2_Yr___10_Yr', '2_Yr___30_Yr', '10_Yr___30_Yr']);
        const labels = Object.keys(data).filter(key => !excludeKeys.has(key));

        // Create a single dataset with all the interest rates for the date
        const dataset = {
          label: `End of Day Value on ${data.Date}`, // Label for the whole dataset
          data: labels.map(label => data[label]), // Array of data points
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        };

        setChartData({
          labels: labels.map(label => label.replace('_', ' ').replace('Mo', ' Month').replace('Yr', ' Year')), // Nicely formatted labels for the x-axis
          datasets: [dataset]
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return <Line data={chartData} />;
};

export default LineChart;


