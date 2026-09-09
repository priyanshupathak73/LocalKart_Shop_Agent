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

// High-Performance In-Memory Cache with In-Flight Request Deduplication
const apiCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 20 * 1000; // 20s fresh cache for instant page/tab transitions

export function invalidateApiCache(pattern) {
  if (!pattern) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
}

async function request(endpoint, options = {}) {
  const token = useAuthStore.getState().token;
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const forceRefresh = options.forceRefresh || options.cache === false;

  const url = getFullUrl(endpoint);
  const cacheKey = `${token || 'anon'}:${url}`;

  // 1. Serve instant cached data for GET requests
  if (isGet && !forceRefresh && apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_TTL_MS) {
      return { data: cached.data, fromCache: true };
    }
  }

  // 2. Deduplicate simultaneous in-flight GET requests
  if (isGet && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const executeRequest = async () => {
    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || 'Something went wrong');
        error.response = { status: response.status, data };
        throw error;
      }

      // Cache successful GET responses
      if (isGet) {
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
      } else {
        // Automatic cache invalidation on any mutation (POST / PUT / DELETE)
        if (url.includes('/products')) invalidateApiCache('/products');
        if (url.includes('/orders')) invalidateApiCache('/orders');
        if (url.includes('/shop')) invalidateApiCache('/shop');
      }

      return { data };
    } finally {
      if (isGet) {
        inFlightRequests.delete(cacheKey);
      }
    }
  };

  if (isGet) {
    const promise = executeRequest();
    inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  return executeRequest();
}

const API = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
  invalidateCache: invalidateApiCache,
};

export default API;
