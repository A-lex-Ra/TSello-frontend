import api from './axios';

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.access_token);
  localStorage.setItem('userId', res.data.user_id)
  console.log('got data:', res.data);
};

export const register = async (email: string, password: string) => {
  await api.post('/auth/register', { email, password });
};
