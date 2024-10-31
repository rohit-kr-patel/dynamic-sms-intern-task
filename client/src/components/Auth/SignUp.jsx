import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api'; // Import the register function from api.js

const SignUp = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the register function from the API module
            await register(username, password); 
            console.log('Sign up successful');

            // Redirect to the sign-in page after successful sign-up
            navigate('/signin');
        } catch (error) {
            console.error('Error during sign up:', error);
            alert(error.message || 'Sign up failed!'); // Handle sign-up error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <div>
                <label>Name:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>
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
            <button type="submit">Sign Up</button>
            <p>Already have an account? <a href="/signin">Sign In</a></p>
        </form>
    );
};

export default SignUp;
