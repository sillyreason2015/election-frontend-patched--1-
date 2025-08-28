const KEY = 'ems_token';
export function getToken(): string | null { if (typeof window === 'undefined') return null; return localStorage.getItem(KEY); }
export function setToken(t: string) { if (typeof window === 'undefined') return; localStorage.setItem(KEY, t); }
export function clearToken() { if (typeof window === 'undefined') return; localStorage.removeItem(KEY); }
