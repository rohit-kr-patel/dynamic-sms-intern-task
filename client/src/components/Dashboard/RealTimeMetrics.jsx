import React, { useEffect, useState } from 'react';
import axios from 'axios';
 // Ensure this file exists for styling

const RealTimeMetrics = () => {
    const [metrics, setMetrics] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true); // Start loading
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/sms-metrics/fetch-sms-metrics', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setMetrics(response.data.metrics);
                } else {
                    setError('Failed to fetch metrics');
                }
            } catch (error) {
                setError('Error fetching metrics');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading metrics...</div>; // Display loading state
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h3>Real-Time Metrics</h3>
            <table>
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Operator</th>
                        <th>Date</th>
                        <th>SMS Sent</th>
                        <th>Success Rates</th>
                        <th>Errors</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.length === 0 ? (
                        <tr>
                            <td colSpan="6">No metrics available.</td>
                        </tr>
                    ) : (
                        metrics.map((metric) => (
                            <tr key={metric.id}>
                                <td>{metric.country}</td>
                                <td>{metric.operator}</td>
                                <td>{new Date(metric.date).toLocaleString()}</td>
                                <td>{metric.sms_sent}</td>
                                <td>{(metric.success_rates * 100).toFixed(2)}%</td>
                                <td>{metric.errors}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RealTimeMetrics;
