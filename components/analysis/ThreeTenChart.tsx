import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';

// Register the necessary components for the Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ThreeTenChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<"line", number[], unknown>>({
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
        text: '3 Month-10 Year Difference Over the Last 365 Days' // Updated title
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date' // Updated x-axis to represent Date
        }
      },
      y: {
        title: {
          display: true,
          text: 'Difference %' // Updated y-axis to represent Contango Percentage
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/threeten');
        const rawData = await response.json();

        if (rawData.length === 0) {
          return;
        }

        // Extract dates and contango values from rawData
        const dates = rawData.map((item: any) => item.Date);
        const contangoValues = rawData.map((item: any) => item.CONTANGO_PCT_3m_10);

        // Create dataset for the chart
        const dataset = {
          label: `Difference %`,
          data: contangoValues,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        };

        // Update the state with the new chart data
        setChartData({
          labels: dates,
          datasets: [dataset]
        });

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return <Line data={chartData} options={options} />;
};

export default ThreeTenChart;


