import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // your base URL
  withCredentials: true, // 👈 this will automatically attach cookies with every request
});

// Now you can just use api.get(), api.post(), etc.
export default api;