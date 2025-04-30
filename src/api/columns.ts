import api from './axios';

export const getColumns = async (userId: number) => {
  const res = await api.get(`/users/${userId}/columns`);
  console.log('[GET api/columns] HTTP', res.status, 'data =', res.data);
  return res.data;
};

export const createColumn = async (userId: number, columnTitle: string) => {
  const res = await api.post(`/users/${userId}/columns`, { title:columnTitle });
  console.log('[POST api/columns] HTTP', res.status, 'data =', res.data);
  return res.data;
}
