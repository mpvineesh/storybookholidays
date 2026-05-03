import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPutMultipart,
} from '../apiClient';

export const DESTINATION_REGIONS = ['Kerala', 'India', 'World'];

export const listDestinations = (region) => {
  const query = region ? `?region=${encodeURIComponent(region)}` : '';
  return apiGet(`/api/destinations${query}`);
};

const buildFormData = (form, imageFile) => {
  const data = new FormData();
  data.append('title', form.title || '');
  data.append('slug', form.slug || '');
  data.append('region', form.region || 'Kerala');
  data.append('shortDescription', form.shortDescription || '');
  data.append('contentHtml', form.contentHtml || '');
  if (imageFile) {
    data.append('image', imageFile);
  }
  return data;
};

export const createDestination = (form, imageFile) =>
  apiPostMultipart('/api/destinations', buildFormData(form, imageFile));

export const updateDestination = (id, form, imageFile) =>
  apiPutMultipart(`/api/destinations/${id}`, buildFormData(form, imageFile));

export const deleteDestination = (id) => apiDelete(`/api/destinations/${id}`);
