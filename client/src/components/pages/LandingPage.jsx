import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Import your CSS file for styling

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="title-section">
                <h1 className="project-title">Dynamic SMS Management</h1>
                <p className="project-quote">"Streamline your messaging process like never before!"</p>
            </div>
            <div className="button-section">
                <Link to="/signin">
                    <button className="auth-button">Sign In</button>
                </Link>
                <Link to="/signup">
                    <button className="auth-button">Sign Up</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
