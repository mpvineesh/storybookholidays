import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPutMultipart,
} from '../apiClient';

export const HOTEL_REGIONS = ['Kerala', 'India', 'World'];
export const HOTEL_TYPES = ['Hotel', 'Resort', 'Homestay', 'Houseboat', 'Villa'];

export const listHotels = () => apiGet('/api/hotels/admin/all');

const buildFormData = (form, { imageFile, galleryFiles = [], keepGallery = [] } = {}) => {
  const data = new FormData();
  data.append('name', form.name || '');
  data.append('slug', form.slug || '');
  data.append('type', form.type || 'Hotel');
  data.append('region', form.region || 'Kerala');
  data.append('location', form.location || '');
  data.append('address', form.address || '');
  data.append('starRating', form.starRating ?? 0);
  data.append('shortDescription', form.shortDescription || '');
  data.append('contentHtml', form.contentHtml || '');
  data.append('amenities', JSON.stringify(form.amenities || []));
  data.append('priceFrom', form.priceFrom ?? 0);
  data.append('priceNote', form.priceNote || '');
  data.append('contactPhone', form.contactPhone || '');
  data.append('contactEmail', form.contactEmail || '');
  data.append('website', form.website || '');
  data.append('mapUrl', form.mapUrl || '');
  data.append('isActive', form.isActive ? 'true' : 'false');
  data.append('sortOrder', form.sortOrder || '0');
  data.append('keepGallery', JSON.stringify(keepGallery));
  if (imageFile) {
    data.append('image', imageFile);
  }
  galleryFiles.forEach((file) => data.append('gallery', file));
  return data;
};

export const createHotel = (form, files) =>
  apiPostMultipart('/api/hotels', buildFormData(form, files));

export const updateHotel = (id, form, files) =>
  apiPutMultipart(`/api/hotels/${id}`, buildFormData(form, files));

export const deleteHotel = (id) => apiDelete(`/api/hotels/${id}`);
