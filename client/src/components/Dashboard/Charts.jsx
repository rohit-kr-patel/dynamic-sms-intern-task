import React from 'react';
import { Bar } from 'react-chartjs-2';
import './Charts.css';

const Charts = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="charts-container">
            <h3 className="charts-title">Charts</h3>
            <div className="chart-wrapper">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default Charts;
