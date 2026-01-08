import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
  const storedUser = browser ? localStorage.getItem('user') : null;
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  
  const { subscribe, set, update } = writable(initialUser);

  return {
    subscribe,
    login: (user) => {
      if (browser) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
      }
      set(user);
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      set(null);
    },
    update
  };
}

export const authStore = createAuthStore();
