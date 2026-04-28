const LOCAL_API_BASE_URL = 'http://localhost:5001';
const PRODUCTION_API_BASE_URL = 'https://storybookholidays.onrender.com';

const isLocalEnvironment = () => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV !== 'production';
  }
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
};

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (isLocalEnvironment() ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL);

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const getRegionContent = async (region) => {
  const response = await fetch(`${API_BASE_URL}/api/region-content/${region}`);
  return parseResponse(response);
};

export const updateRegionContent = async (token, region, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/region-content/${region}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const uploadRegionContentImage = async (token, file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/region-content/upload-image`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  return parseResponse(response);
};
