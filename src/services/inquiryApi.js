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
    const message =
      (Array.isArray(data.errors) && data.errors[0]) ||
      data.message ||
      'Request failed';
    throw new Error(message);
  }

  return data;
};

export const submitInquiry = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });

  return parseResponse(response);
};

export const ACCOMMODATION_TYPES = [
  'Budget',
  'Standard',
  'Premium',
  'Luxury',
  'Resort',
  'Homestay',
  'Houseboat',
];
