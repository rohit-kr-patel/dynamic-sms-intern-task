import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OperatorManagement = () => {
    const [country, setCountry] = useState('');
    const [operator, setOperator] = useState('');
    const [isHighPriority, setIsHighPriority] = useState(false);
    const [operatorList, setOperatorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch the operator list on component mount
    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/country-operators/fetch-operators');
                if (Array.isArray(response.data)) {
                    setOperatorList(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setError('Invalid data received from the server.');
                }
            } catch (err) {
                console.error('Error fetching operators:', err);
                setError('Failed to fetch operators. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOperators();
    }, []);

    const addOperator = async () => {
        if (!country || !operator) {
            setError('Both country and operator fields are required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/country-operators/reg-c-operator', {
                country,
                operator,
                isHighPriority,
            });

            if (response.data) {
                setOperatorList([...operatorList, response.data]);
                setCountry('');
                setOperator('');
                setIsHighPriority(false);
                setError('');
            }
        } catch (err) {
            console.error('Error adding operator:', err);
            setError('Failed to add the operator. Please try again.');
        }
    };

    const removeOperator = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/country-operators/delete-operator/${id}`);
            setOperatorList(operatorList.filter((op) => op._id !== id));
        } catch (err) {
            console.error('Error removing operator:', err);
            setError('Failed to remove the operator. Please try again.');
        }
    };

    return (
        <div className="operator-management">
            <h3>Country-Operator Management</h3>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Operator"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isHighPriority}
                        onChange={(e) => setIsHighPriority(e.target.checked)}
                    />
                    High Priority
                </label>
                <button onClick={addOperator}>Add Operator</button>
            </div>

            <div className="operator-list">
                <h4>Operators List:</h4>
                {loading ? (
                    <p>Loading operators...</p>
                ) : (
                    <ul>
                        {operatorList.length > 0 ? (
                            operatorList.map((op) => (
                                <li key={op._id}>
                                    {op.country} - {op.operator}{' '}
                                    {op.isHighPriority && <span>(High Priority)</span>}
                                    <button onClick={() => removeOperator(op._id)}>Remove</button>
                                </li>
                            ))
                        ) : (
                            <li>No operators available</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OperatorManagement;
