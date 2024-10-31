import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Welcome to Dynamic SMS Management</h2>
            <p className="welcome-text">Your one-stop solution for managing SMS operations seamlessly!</p>
            <p className="best-text">Empowering communication at your fingertips.</p>
            <button 
                onClick={handleSignOut} 
                className="signout-button" 
                aria-label="Sign out"
            >
                Sign Out
            </button>

            {/* Navigation Buttons */}
            <div className="management-buttons">
                <button 
                    onClick={() => navigateTo('/country-operators')} 
                    className="management-button"
                    aria-label="Manage Country Operators"
                >
                    Manage Country Operators
                </button>
                <button 
                    onClick={() => navigateTo('/send-sms')} 
                    className="management-button"
                    aria-label="Send SMS"
                >
                    Send SMS
                </button>
                <button 
                    onClick={() => navigateTo('/process-control')} 
                    className="management-button"
                    aria-label="Control Processes"
                >
                    Control Processes
                </button>
                <button 
                    onClick={() => navigateTo('/sms-metrics')} 
                    className="management-button"
                    aria-label="View SMS Metrics"
                >
                    View SMS Metrics
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
