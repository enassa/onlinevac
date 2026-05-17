const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export async function httpClient<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data as T;
}

export const http = {
  get<T>(endpoint: string): Promise<T> {
    return httpClient<T>(endpoint, { method: 'GET' });
  },
  post<T>(endpoint: string, body: unknown): Promise<T> {
    return httpClient<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },
  patch<T>(endpoint: string, body: unknown): Promise<T> {
    return httpClient<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  },
  put<T>(endpoint: string, body: unknown): Promise<T> {
    return httpClient<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete<T>(endpoint: string): Promise<T> {
    return httpClient<T>(endpoint, { method: 'DELETE' });
  },
};
