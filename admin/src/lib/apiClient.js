const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const TOKEN_KEY = 'storybook_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const buildHeaders = (extra = {}, includeJson = true) => {
  const headers = { ...extra };
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
};

export const apiGet = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: buildHeaders({}, false),
  });
  return parseResponse(response);
};

export const apiPost = async (path, body) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body || {}),
  });
  return parseResponse(response);
};

export const apiPut = async (path, body) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body || {}),
  });
  return parseResponse(response);
};

export const apiPatch = async (path, body) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(body || {}),
  });
  return parseResponse(response);
};

export const apiDelete = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: buildHeaders({}, false),
  });
  return parseResponse(response);
};

export const apiPostMultipart = async (path, formData) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders({}, false),
    body: formData,
  });
  return parseResponse(response);
};

export const apiPutMultipart = async (path, formData) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: buildHeaders({}, false),
    body: formData,
  });
  return parseResponse(response);
};

export { API_BASE_URL };
