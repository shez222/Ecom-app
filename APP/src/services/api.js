import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgotpassword`, { email, role: 'user' });
    return response.data;
    // alert('Password reset link sent to your email.');
  } catch (error) {
    console.error('Reset password error:', error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const searchExams = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};
