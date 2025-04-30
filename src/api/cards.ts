import api from './axios';

export interface CardDto {
  id: number;
  title: string;
  description: string;
  order: number;
  checked: boolean;
  columnId: number;
  comments?: string;
}

// Создать карточку
export const createCard = (userId: number | string, columnId: number | string, title: string) =>
  api.post(`/users/${userId}/columns/${columnId}/cards`, { title, description: '', order: 0, checked: false });

// Обновить любую часть карточки
export const updateCard = (userId: number | string, columnId: number | string, cardId: number | string, data: Partial<CardDto>) =>
  api.patch(`/users/${userId}/columns/${columnId}/cards/${cardId}`, data);

export const deleteCard = (userId: number | string, columnId: number | string, cardId: number | string) =>
  api.delete(`/users/${userId}/columns/${columnId}/cards/${cardId}`);