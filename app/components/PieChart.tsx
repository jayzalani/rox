import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChartData } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: PieChartData[];
}

export default function PieChart({ data }: PieChartProps) {
  if (!data || data.length === 0) {
    return <div>No data available for the pie chart.</div>;
  }

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Category Distribution',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}