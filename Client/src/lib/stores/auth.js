import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedToken = browser ? localStorage.getItem('admin_token') : null;
const storedUser = browser
  ? JSON.parse(localStorage.getItem('admin_user'))
  : null;

export const adminToken = writable(storedToken);
export const adminUser = writable(storedUser);

if (browser) {
    localStorage.setItem('admin_token', adminToken);
    localStorage.setItem('admin_user', JSON.stringify(adminUser));
}


