const LOCAL_API_BASE_URL = 'http://localhost:5001';
const PRODUCTION_API_BASE_URL = 'https://api.storybookholidays.com';

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

export const getPackages = async () => {
  const response = await fetch(`${API_BASE_URL}/api/packages`);

  return parseResponse(response);
};

export const getDestinations = async (region) => {
  const query = region ? `?region=${encodeURIComponent(region)}` : '';
  const response = await fetch(`${API_BASE_URL}/api/destinations${query}`);

  return parseResponse(response);
};

export const getDestinationBySlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/api/destinations/slug/${slug}`);

  return parseResponse(response);
};

export const getPackageBySlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/api/packages/slug/${slug}`);

  return parseResponse(response);
};
