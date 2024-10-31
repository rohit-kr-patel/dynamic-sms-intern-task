import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:5000';

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to inject JWT token into headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get JWT from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request errors gracefully
);

// Login function to authenticate user and store JWT token
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    console.log('Token received:', response.data.token); // Verify token here

    localStorage.setItem('token', response.data.token); // Store token
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error);
    throw error.response?.data || 'Login error';
  }
};

// Register function for new users
export const register = async (username, password) => {
  const response = await api.post('/register', { username, password });
  return response.data;
};

// Function to fetch metrics data
export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

// Function to fetch all available programs
export const getPrograms = async () => {
  const response = await api.get('/programs');
  return response.data;
};

// Function to control a specific program (start/stop)
export const controlProgram = async (programId, action) => {
  const response = await api.post(`/programs/${programId}/${action}`);
  return response.data;
};

// Function to get country-operator pairs
export const getPairs = async () => {
  const response = await api.get('/country-operator-pairs');
  return response.data;
};

// Function to add a new country-operator pair
export const addPair = async (pair) => {
  const response = await api.post('/country-operator-pairs', pair);
  return response.data;
};

// Function to update an existing country-operator pair
export const updatePair = async (pairId, updatedPair) => {
  const response = await api.put(`/country-operator-pairs/${pairId}`, updatedPair);
  return response.data;
};

// Function to send SMS using JWT for authentication
export const sendSMS = async (message) => {
  try {
    const payload = { message };

    // Send SMS using the Axios instance with token in headers
    const response = await api.post('/sms/send', payload);

    console.log('SMS sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send SMS:', error.response?.data || error.message);
    throw error.response?.data || 'SMS sending error';
  }
};

// New function to register a country-operator pair
export const registerCountryOperator = async (operatorData) => {
  try {
    const response = await api.post('/api/country-operators/reg-c-operator', operatorData);
    console.log('Country-operator pair registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to register country-operator pair:', error.response?.data || error.message);
    throw error.response?.data || 'Registration error';
  }
};

// Export the Axios instance and all functions for external use
export default api;