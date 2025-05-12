import { MMKV } from 'react-native-mmkv';

// Use MMKV for key pair easy storage
export const storage = new MMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.delete(key);
}
