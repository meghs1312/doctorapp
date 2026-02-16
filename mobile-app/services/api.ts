import { Platform } from 'react-native';


const DEVICE_IP = '192.168.11.105';

const BASE_URL =
  Platform.OS === 'android'
    ? `http://10.0.2.2:5000/api`
    : `http://${DEVICE_IP}:5000/api`;

function buildUrl(endpoint: string, params?: Record<string, string | number | string[] | undefined>) {
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        const joined = value.filter(Boolean).join(',');
        if (joined) search.append(key, joined);
      } else if (value !== '') {
        search.append(key, String(value));
      }
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

export const apiGet = async (endpoint: string, params?: Record<string, string | number | string[] | undefined>) => {
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
