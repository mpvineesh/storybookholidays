import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPutMultipart,
} from '../apiClient';

export const listBlogs = (tag) => {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : '';
  return apiGet(`/api/blogs${query}`);
};

const buildFormData = (form, imageFile) => {
  const data = new FormData();
  data.append('title', form.title || '');
  data.append('slug', form.slug || '');
  data.append('author', form.author || '');
  data.append('excerpt', form.excerpt || '');
  data.append('contentHtml', form.contentHtml || '');
  data.append('tags', form.tags || '');
  if (imageFile) {
    data.append('image', imageFile);
  }
  return data;
};

export const createBlog = (form, imageFile) =>
  apiPostMultipart('/api/blogs', buildFormData(form, imageFile));

export const updateBlog = (id, form, imageFile) =>
  apiPutMultipart(`/api/blogs/${id}`, buildFormData(form, imageFile));

export const deleteBlog = (id) => apiDelete(`/api/blogs/${id}`);
