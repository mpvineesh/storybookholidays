import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPutMultipart,
} from '../apiClient';

export const listTestimonials = () => apiGet('/api/testimonials/admin/all');

const buildFormData = (form, imageFile, removeImage = false) => {
  const data = new FormData();
  data.append('name', form.name || '');
  data.append('role', form.role || '');
  data.append('quote', form.quote || '');
  data.append('region', form.region || '');
  data.append('isActive', form.isActive ? 'true' : 'false');
  data.append('sortOrder', String(form.sortOrder ?? 0));
  if (imageFile) {
    data.append('image', imageFile);
  } else if (removeImage) {
    data.append('removeImage', 'true');
  }
  return data;
};

export const createTestimonial = (form, imageFile) =>
  apiPostMultipart('/api/testimonials', buildFormData(form, imageFile));

export const updateTestimonial = (id, form, imageFile, removeImage) =>
  apiPutMultipart(`/api/testimonials/${id}`, buildFormData(form, imageFile, removeImage));

export const deleteTestimonial = (id) => apiDelete(`/api/testimonials/${id}`);
