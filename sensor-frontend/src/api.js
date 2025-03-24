import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Backend URL
});

// Frontend'de artık token göndermiyoruz
api.interceptors.request.use((config) => {
  // Burada token ile ilgili işlem yapmıyoruz
  return config;
});

export default api;