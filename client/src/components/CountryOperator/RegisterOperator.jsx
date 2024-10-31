import React, { useState } from 'react';
import './RegisterOperator.css'; // Ensure this file exists for styling

const RegisterOperator = () => {
    const [country, setCountry] = useState('');
    const [operator, setOperator] = useState('');
    const [isHighPriority, setIsHighPriority] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        try {
            const response = await fetch('http://localhost:5000/api/country-operators/reg-c-operator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ country, operator, isHighPriority }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Operator added successfully!');
                // Clear the form
                setCountry('');
                setOperator('');
                setIsHighPriority(false);
            } else {
                setMessage(data.error || 'Failed to add operator. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred while adding the operator. Please check your network.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="register-operator-container">
            <h2 className="register-title">Register Operator</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <label htmlFor="country" className="form-label">Country:</label>
                <input 
                    type="text" 
                    id="country" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    required 
                    className="form-input" 
                />

                <label htmlFor="operator" className="form-label">Operator Name:</label>
                <input 
                    type="text" 
                    id="operator" 
                    value={operator} 
                    onChange={(e) => setOperator(e.target.value)} 
                    required 
                    className="form-input" 
                />

                <label className="form-label">
                    <input 
                        type="checkbox" 
                        checked={isHighPriority} 
                        onChange={(e) => setIsHighPriority(e.target.checked)} 
                    />
                    High Priority
                </label>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Operator'}
                </button>
            </form>
            {message && <p className="feedback-message">{message}</p>}
        </div>
    );
};

export default RegisterOperator;
