import api from './axios';

export const getColumns = async (userId: string | number) => {
  const res = await api.get(`/users/${userId}/columns`);
  console.log('[api/columns] HTTP', res.status, 'data =', res.data);
  return res.data;
};
