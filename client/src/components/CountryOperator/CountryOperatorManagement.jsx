import React, { useEffect, useState } from 'react';
import { registerCountryOperator, getPairs, updatePair, deletePair } from './api'; // Ensure these functions are implemented in your api.js file
import './CountryOperatorManagement.css'; // Ensure this CSS file exists

const CountryOperatorManagement = () => {
    const [operatorList, setOperatorList] = useState([]);
    const [formData, setFormData] = useState({
        country: '',
        operator: '',
        isHighPriority: false
    });
    const [message, setMessage] = useState('');
    const [updateId, setUpdateId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOperators();
    }, []);

    const fetchOperators = async () => {
        setLoading(true);
        try {
            const data = await getPairs();
            setOperatorList(data);
            setMessage('');
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage('Failed to fetch operators.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (updateId) {
                await updatePair(updateId, formData);
                setMessage('Operator updated successfully!');
            } else {
                await registerCountryOperator(formData);
                setMessage('Operator added successfully!');
            }
            resetForm();
            fetchOperators();
        } catch (error) {
            console.error('Save error:', error);
            setMessage('An error occurred while saving the operator.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ country: '', operator: '', isHighPriority: false });
        setUpdateId(null);
    };

    const handleEdit = (op) => {
        setFormData({
            country: op.country,
            operator: op.operator,
            isHighPriority: op.isHighPriority
        });
        setUpdateId(op._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this operator?')) return;

        try {
            await deletePair(id);
            setMessage('Operator deleted successfully!');
            fetchOperators();
            resetForm();
        } catch (error) {
            console.error('Delete error:', error);
            setMessage('An error occurred while deleting the operator.');
        }
    };

    return (
        <div className="operator-management-container">
            <h2 className="management-title">Country Operator Management</h2>

            <form onSubmit={handleSubmit} className="management-form">
                <label htmlFor="country">Country:</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="operator">Operator Name:</label>
                <input
                    type="text"
                    id="operator"
                    name="operator"
                    value={formData.operator}
                    onChange={handleChange}
                    required
                />

                <label>
                    <input
                        type="checkbox"
                        name="isHighPriority"
                        checked={formData.isHighPriority}
                        onChange={handleChange}
                    />
                    High Priority
                </label>

                <button type="submit" disabled={!formData.country || !formData.operator || isSubmitting}>
                    {updateId ? 'Update Operator' : 'Add Operator'}
                </button>
            </form>

            {message && (
                <p className={`feedback-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </p>
            )}

            {loading ? (
                <p>Loading operators...</p>
            ) : (
                <table className="operator-table">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Operator</th>
                            <th>High Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operatorList.length > 0 ? (
                            operatorList.map((op) => (
                                <tr key={op._id}>
                                    <td>{op.country}</td>
                                    <td>{op.operator}</td>
                                    <td>{op.isHighPriority ? 'Yes' : 'No'}</td>
                                    <td>
                                        <button onClick={() => handleEdit(op)}>Edit</button>
                                        <button onClick={() => handleDelete(op._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No operators found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CountryOperatorManagement;