import AsyncStorage from '@react-native-async-storage/async-storage';

const CALLS_KEY = '@cleantrack_calls';

export async function loadCalls() {
  try {
    const json = await AsyncStorage.getItem(CALLS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Load error:', e);
    return [];
  }
}

export async function saveCalls(calls) {
  try {
    await AsyncStorage.setItem(CALLS_KEY, JSON.stringify(calls));
  } catch (e) {
    console.error('Save error:', e);
  }
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}
