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

const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

const getMultipartHeaders = (token) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
};

export const getAdminSession = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/session`, {
    headers: getHeaders(token),
  });

  return parseResponse(response);
};

export const getItineraries = async () => {
  const response = await fetch(`${API_BASE_URL}/api/itineraries`);

  return parseResponse(response);
};

export const createItinerary = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const updateItinerary = async (token, itineraryId, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const deleteItinerary = async (token, itineraryId) => {
  const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  return parseResponse(response);
};

export const getPackages = async () => {
  const response = await fetch(`${API_BASE_URL}/api/packages`);

  return parseResponse(response);
};

export const getDestinations = async () => {
  const response = await fetch(`${API_BASE_URL}/api/destinations`);

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

export const createPackage = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/packages`, {
    method: 'POST',
    headers: getMultipartHeaders(token),
    body: payload,
  });

  return parseResponse(response);
};

export const updatePackage = async (token, packageId, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/packages/${packageId}`, {
    method: 'PUT',
    headers: getMultipartHeaders(token),
    body: payload,
  });

  return parseResponse(response);
};

export const deletePackage = async (token, packageId) => {
  const response = await fetch(`${API_BASE_URL}/api/packages/${packageId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  return parseResponse(response);
};

export const createDestination = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/destinations`, {
    method: 'POST',
    headers: getMultipartHeaders(token),
    body: payload,
  });

  return parseResponse(response);
};

export const updateDestination = async (token, destinationId, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/destinations/${destinationId}`, {
    method: 'PUT',
    headers: getMultipartHeaders(token),
    body: payload,
  });

  return parseResponse(response);
};

export const deleteDestination = async (token, destinationId) => {
  const response = await fetch(`${API_BASE_URL}/api/destinations/${destinationId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  return parseResponse(response);
};
