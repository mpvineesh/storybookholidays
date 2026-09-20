import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPutMultipart,
} from '../apiClient';

export const listTeamMembers = () => apiGet('/api/team-members/admin/all');

const buildFormData = (form, imageFile, removeImage = false) => {
  const data = new FormData();
  data.append('name', form.name || '');
  data.append('role', form.role || '');
  data.append('bio', form.bio || '');
  data.append('isActive', form.isActive ? 'true' : 'false');
  data.append('sortOrder', String(form.sortOrder ?? 0));
  if (imageFile) {
    data.append('image', imageFile);
  } else if (removeImage) {
    data.append('removeImage', 'true');
  }
  return data;
};

export const createTeamMember = (form, imageFile) =>
  apiPostMultipart('/api/team-members', buildFormData(form, imageFile));

export const updateTeamMember = (id, form, imageFile, removeImage) =>
  apiPutMultipart(`/api/team-members/${id}`, buildFormData(form, imageFile, removeImage));

export const deleteTeamMember = (id) => apiDelete(`/api/team-members/${id}`);
