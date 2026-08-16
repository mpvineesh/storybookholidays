import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPutMultipart,
} from '../apiClient';

export const listRegions = () => apiGet('/api/regions');

export const listAdminRegions = () => apiGet('/api/regions/admin/all');

const buildFormData = (form, imageFile) => {
  const data = new FormData();
  data.append('title', form.title || '');
  data.append('region', form.region || '');
  data.append('slug', form.slug || '');
  data.append('tagline', form.tagline || '');
  data.append('description', form.description || '');
  data.append('isActive', form.isActive ? 'true' : 'false');
  data.append('sortOrder', form.sortOrder || '0');
  if (imageFile) {
    data.append('image', imageFile);
  }
  return data;
};

export const createRegion = (form, imageFile) =>
  apiPostMultipart('/api/regions', buildFormData(form, imageFile));

export const updateRegion = (id, form, imageFile) =>
  apiPutMultipart(`/api/regions/${id}`, buildFormData(form, imageFile));

export const deleteRegion = (id) => apiDelete(`/api/regions/${id}`);
