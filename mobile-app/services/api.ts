import { Platform } from 'react-native';

/**
 * API Base URL – change this if doctors don't load:
 *
 * - Android emulator: use 10.0.2.2 (points to your computer)
 * - iOS simulator: use localhost or 127.0.0.1
 * - Physical device: use your computer's IP on the same WiFi (e.g. 192.168.1.5)
 *   Find it: Mac: System Preferences → Network | Windows: ipconfig
 */
const DEVICE_IP = '192.168.11.105'; // ← Change to your computer's IP when using a physical device

const BASE_URL =
  Platform.OS === 'android'
    ? `http://10.0.2.2:5000/api` // Android emulator → host
    : `http://${DEVICE_IP}:5000/api`; // iOS simulator or physical device (use your computer's IP)

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
