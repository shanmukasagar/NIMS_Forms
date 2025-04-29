import axios from 'axios';

// Dynamically determine the base URL based on the browser's location
const baseURL = `${window.location.protocol}//${window.location.hostname}:4000`;

const api = axios.create({
  baseURL, // Dynamically set the base URL
  withCredentials: true, // Automatically attach cookies with every request
});

export default api;