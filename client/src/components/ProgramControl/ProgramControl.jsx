import React, { useState } from 'react';
import StartProcess from '../Process/StartProcess';
import StopProcess from '../Process/StopProcess';
import './ProgramControl.css';

const ProgramControl = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSuccessMessage = (msg) => {
        setMessage(msg);
        setError('');
    };

    const handleErrorMessage = (err) => {
        setError(err);
        setMessage('');
    };

    return (
        <div className="program-control-container">
            <h2>Program Control</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <StartProcess onSuccess={handleSuccessMessage} onError={handleErrorMessage} />
            <StopProcess onSuccess={handleSuccessMessage} onError={handleErrorMessage} />
            {/* You can add more controls or information here */}
        </div>
    );
};

export default ProgramControl;
