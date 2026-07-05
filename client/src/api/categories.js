import api from './axios';

export const getCategories = () => api.get('/categories');
export const getCategoryQueries = (slug, params) =>
  api.get(`/categories/${slug}/queries`, { params });
