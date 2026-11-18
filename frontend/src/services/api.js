// API client with JWT support and graceful fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('leaveflow_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('leaveflow_token', token);
  } else {
    localStorage.removeItem('leaveflow_token');
  }
}

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Token expired or invalid
      setAuthToken(null);
      localStorage.removeItem('leaveflow_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    // If backend is unreachable (e.g. offline dev), throw to allow fallback handler
    throw err;
  }
}
