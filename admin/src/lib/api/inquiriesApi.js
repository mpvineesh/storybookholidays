import { apiDelete, apiGet, apiPatch } from '../apiClient';

export const INQUIRY_REGIONS = ['Kerala', 'India', 'World'];
export const INQUIRY_STATUSES = ['new', 'contacted', 'closed'];

export const listInquiries = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.region) params.set('region', filters.region);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  const query = params.toString();
  return apiGet(`/api/inquiries${query ? `?${query}` : ''}`);
};

export const updateInquiry = (id, payload) =>
  apiPatch(`/api/inquiries/${id}`, payload);

export const deleteInquiry = (id) => apiDelete(`/api/inquiries/${id}`);
