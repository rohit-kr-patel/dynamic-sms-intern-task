import React, { useState } from 'react';
import axios from 'axios';

 // Import your CSS file for styling

const SendSMS = () => {
    const [smsData, setSmsData] = useState({
        phoneNumber: '',
        message: '',
        country: '',
        operator: '',
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSmsData({ ...smsData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(''); // Reset feedback message
        setLoading(true); // Set loading state to true

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/sms/send', smsData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setFeedback(response.data.msg || 'SMS sent successfully!');
        } catch (error) {
            console.error('Error occurred:', error);
            if (error.response) {
                setFeedback(`Error: ${error.response.data.msg || 'Unknown error occurred'}`);
            } else if (error.request) {
                setFeedback('Error: No response from server');
            } else {
                setFeedback(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={handleSubmit} className="send-sms-form">
            <input 
                type="text" 
                name="phoneNumber" 
                placeholder="Phone Number" 
                onChange={handleChange} 
                required 
            />
            <input 
                type="text" 
                name="message" 
                placeholder="Message" 
                onChange={handleChange} 
                required 
            />
            <input 
                type="text" 
                name="country" 
                placeholder="Country" 
                onChange={handleChange} 
                required 
            />
            <input 
                type="text" 
                name="operator" 
                placeholder="Operator" 
                onChange={handleChange} 
                required 
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send SMS'}
            </button>
            {feedback && <p className="feedback-message">{feedback}</p>} {/* Feedback message */}
        </form>
    );
};

export default SendSMS;
