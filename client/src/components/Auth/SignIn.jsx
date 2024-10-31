import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api'; // Import the login function from api.js

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the login function from the API module
            const response = await login(username, password);
            console.log('Login successful:', response);

            if (response.token) {
                // Store token in local storage
                localStorage.setItem('token', response.token);
                navigate('/dashboard'); // Redirect to dashboard on success
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert(error.message || 'Login failed!'); // Handle login error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <div>
                <label>Username:</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Password:</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">Sign In</button>
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </form>
    );
};

export default SignIn;
