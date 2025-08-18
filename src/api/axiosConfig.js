import axios from 'axios';

// Create an Axios instance with a base URL
// Adjust the baseURL to match your Spring Boot backend's address
const instance = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend URL if different
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here for things like authentication tokens
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('jwtToken'); // Or wherever you store your token
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default instance;
