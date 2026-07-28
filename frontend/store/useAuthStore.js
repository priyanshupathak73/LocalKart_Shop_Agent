import { create } from 'zustand';

export const useAuthStore = create((set) => {
  const getLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  };

  const setLocalStorageItem = (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  };

  const removeLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };

  const storedUser = getLocalStorageItem('localkart_user');
  const storedToken = getLocalStorageItem('localkart_token');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    login: (user, token) => {
      setLocalStorageItem('localkart_user', JSON.stringify(user));
      setLocalStorageItem('localkart_token', token);
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      removeLocalStorageItem('localkart_user');
      removeLocalStorageItem('localkart_token');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
