// Thin fetch wrapper for the Express API.
// VITE_API_URL points at the deployed backend (e.g. https://plf-api.vercel.app/api);
// in development it is empty and Vite proxies /api to http://localhost:5000.
const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details || {};
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('We could not reach our server. Please check your connection and try again.', 0);
  }
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* empty or non-JSON body */
  }
  if (!res.ok) throw new ApiError(body?.error || `Request failed (${res.status})`, res.status, body?.details);
  return body;
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
};
