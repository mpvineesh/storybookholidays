import { apiGet, apiPostMultipart, apiPut } from '../apiClient';

export const REGIONS = ['Kerala', 'India', 'World'];

export const getRegionContent = (region) =>
  apiGet(`/api/region-content/${region}`);

export const updateRegionContent = (region, payload) =>
  apiPut(`/api/region-content/${region}`, payload);

export const uploadRegionContentImage = (file) => {
  const data = new FormData();
  data.append('image', file);
  return apiPostMultipart('/api/region-content/upload-image', data);
};
