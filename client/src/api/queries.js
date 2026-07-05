import api from './axios';

export const checkDuplicate = (data) => api.post('/queries/check-duplicate', data);
export const createQuery = (formData) =>
  api.post('/queries', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getQuery = (id) => api.get(`/queries/${id}`);
export const getRecentQueries = (params) => api.get('/queries', { params });
