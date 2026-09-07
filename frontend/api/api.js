import { useAuthStore } from '../store/useAuthStore';

const getBaseUrl = () => '/api';

export function getFullUrl(endpoint) {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const baseUrl = getBaseUrl();
  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (baseUrl.endsWith('/api') && path.startsWith('/api/')) {
    path = path.substring(4);
  } else if (!baseUrl.endsWith('/api') && !path.startsWith('/api/')) {
    path = `/api${path}`;
  }

  return `${baseUrl}${path}`;
}

async function request(endpoint, options = {}) {
  const token = useAuthStore.getState().token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = getFullUrl(endpoint);

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
}

const API = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};

export default API;
