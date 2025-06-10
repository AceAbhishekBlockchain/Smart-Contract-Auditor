import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SeverityDistributionChart = ({ vulnerabilities }) => {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return (
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-blue-300">Vulnerability Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">No vulnerabilities detected to display distribution.</p>
        </CardContent>
      </Card>
    );
  }

  const severityCounts = vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(severityCounts),
    datasets: [
      {
        label: 'Vulnerability Count',
        data: Object.values(severityCounts),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)', // High - Red
          'rgba(245, 158, 11, 0.7)', // Medium - Amber
          'rgba(34, 197, 94, 0.7)', // Low - Green
          'rgba(99, 102, 241, 0.7)', // Info/Other - Indigo
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(99, 102, 241, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0', // slate-200
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)', // slate-800
        titleColor: '#f1f5f9', // slate-100
        bodyColor: '#cbd5e1', // slate-300
        padding: 10,
        cornerRadius: 4,
        borderColor: 'rgba(71, 85, 105, 1)', // slate-600
        borderWidth: 1,
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    }
  };

  return (
    <Card className="bg-slate-800/70 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-blue-300">Vulnerability Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-72 md:h-80">
        <Doughnut data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default SeverityDistributionChart;