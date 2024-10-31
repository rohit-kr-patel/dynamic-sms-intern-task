import React, { useState } from 'react';
import axios from 'axios';
 // Create a separate CSS file for styling

const StopProcess = () => {
    const [sessionName, setSessionName] = useState('');
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
            console.log('Stopping process with session name:', sessionName);
            const response = await axios.post('http://localhost:5000/api/process/stop', {
                sessionName,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setMessage('Process stopped successfully!');
            console.log('Process stopped:', response.data);
            setSessionName(''); // Clear input field after successful stop
        } catch (error) {
            console.error('Error stopping process:', error.response ? error.response.data : error);
            setError('Failed to stop process. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stop-process-form">
            <h3>Stop Process</h3>
            <div>
                <label>Session Name:</label>
                <input 
                    type="text" 
                    value={sessionName} 
                    onChange={(e) => setSessionName(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Stop'}
            </button>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default StopProcess;
