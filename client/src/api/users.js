import api from './axios';

export const getProfile = (id) => api.get(`/users/${id}`);
export const setupProfile = (data) => api.put('/users/profile-setup', data);
