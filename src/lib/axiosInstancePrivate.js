// lib/axiosInstance.js
import axios from 'axios';

const axiosInstancePrivate = axios.create({
  baseURL: 'http://localhost:3200', // Your base API URL
});

// Intercept every request to add the token to the headers
axiosInstancePrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstancePrivate;
