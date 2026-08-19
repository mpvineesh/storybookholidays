import { apiGet, apiPut } from '../apiClient';

export const getAboutContent = () => apiGet('/api/about-content');

export const updateAboutContent = (payload) => apiPut('/api/about-content', payload);
