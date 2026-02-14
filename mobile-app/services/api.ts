const BASE_URL = 'http://192.168.11.105:5000/api';

function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>) {
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') search.append(key, String(value));
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

export const apiGet = async (endpoint: string, params?: Record<string, string | number | undefined>) => {
  const response = await fetch(buildUrl(endpoint, params));
  if (!response.ok) throw new Error('API request failed');
  return response.json();
};

export const apiPost = async (endpoint: string, body: object) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('API request failed');
  return response.json();
};
