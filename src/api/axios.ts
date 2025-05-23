import axios from 'axios';

const api = axios.create({
  baseURL: 'https://51.68.176.127:443/'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (config.headers && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
