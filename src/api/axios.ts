import axios from 'axios';

const api = axios.create({
  baseURL: 'http://51.68.176.127:3000/'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (config.headers && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
