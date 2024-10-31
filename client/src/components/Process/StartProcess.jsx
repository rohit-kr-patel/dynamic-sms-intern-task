import React, { useState } from 'react';
import axios from 'axios';
// Create a separate CSS file for styling

const StartProcess = () => {
    const [sessionName, setSessionName] = useState('');
    const [program, setProgram] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            console.log('Starting process with:', { sessionName, program });
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
            console.log('Process started:', response.data);
            setSessionName(''); // Clear the input fields after successful submission
            setProgram('');
        } catch (error) {
            console.error('Error starting process:', error.response ? error.response.data : error);
            setError('Failed to start process. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="start-process-form">
            <h3>Start Process</h3>
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
                {loading ? <span className="spinner" /> : 'Start'}
            </button>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default StartProcess;
