import api from './axios';

export const postAnswer = (formData) =>
  api.post('/answers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const acceptAnswer = (id) => api.put(`/answers/${id}/accept`);
