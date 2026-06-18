import { create } from 'zustand';

export const useAuthStore = create((set) => {
  // Initialize state from localstorage if available
  const storedUser = localStorage.getItem('localkart_user');
  const storedToken = localStorage.getItem('localkart_token');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    login: (user, token) => {
      localStorage.setItem('localkart_user', JSON.stringify(user));
      localStorage.setItem('localkart_token', token);
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('localkart_user');
      localStorage.removeItem('localkart_token');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
