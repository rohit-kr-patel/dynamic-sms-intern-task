import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Ensure you have a CSS file for styling

const ProcessControl = () => {
    const [sessionName, setSessionName] = useState('');
    const [program, setProgram] = useState('');
    const [activeProcesses, setActiveProcesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchActiveProcesses(); // Fetch active processes on component mount
    }, []);

    const fetchActiveProcesses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/process/sessions');
            console.log('Fetched active processes:', response.data);
            if (response.data.success) {
                setActiveProcesses(response.data.sessions);
            } else {
                setError('Failed to fetch active processes.');
            }
        } catch (error) {
            console.error('Error fetching active processes:', error);
            setError('Error fetching active processes.');
        }
    };

    const handleStartProcess = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5000/api/process/start', {
                sessionName,
                program,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setMessage('Process started successfully!');
            fetchActiveProcesses();
        } catch (error) {
            console.error('Error starting process:', error.response ? error.response.data : error);
            setError('Failed to start process. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStopProcess = async (session) => {
        try {
            await axios.post('http://localhost:5000/api/process/stop', { sessionName: session });
            fetchActiveProcesses();
        } catch (error) {
            console.error('Error stopping process:', error);
            setError('Failed to stop process. Please try again.');
        }
    };

    return (
        <div className="process-control-container">
            <h3>Process Control</h3>
            <form onSubmit={handleStartProcess}>
                <div>
                    <label>Session Name:</label>
                    <input
                        type="text"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Program:</label>
                    <input
                        type="text"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Starting...' : 'Start Process'}
                </button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <h4>Active Processes</h4>
            <ul>
                {activeProcesses.length === 0 ? (
                    <li>No active processes found.</li>
                ) : (
                    activeProcesses.map((process) => (
                        <li key={process.sessionName}>
                            {process.sessionName} (PID: {process.pid}, Name: {process.name})
                            <button onClick={() => handleStopProcess(process.sessionName)}>Stop</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ProcessControl;
