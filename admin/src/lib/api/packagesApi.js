import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPutMultipart,
} from '../apiClient';

export const PACKAGE_REGIONS = ['Kerala', 'India', 'World'];

export const listPackages = () => apiGet('/api/packages');

export const buildPackageFormData = (form, imageFile) => {
  const data = new FormData();
  data.append('title', form.title || '');
  data.append('slug', form.slug || '');
  data.append('region', form.region || 'Kerala');
  data.append('duration', form.duration || '');
  data.append('shortDescription', form.shortDescription || '');
  data.append('contentHtml', form.contentHtml || '');
  if (imageFile) {
    data.append('image', imageFile);
  }
  return data;
};

export const createPackage = (form, imageFile) =>
  apiPostMultipart('/api/packages', buildPackageFormData(form, imageFile));

export const updatePackage = (id, form, imageFile) =>
  apiPutMultipart(`/api/packages/${id}`, buildPackageFormData(form, imageFile));

export const deletePackage = (id) => apiDelete(`/api/packages/${id}`);
