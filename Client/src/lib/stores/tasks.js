import { writable } from 'svelte/store';

export const tasksStore = writable([]);

export const taskStatuses = [
  'Not Started',
  'In Progress',
  'In Review',
  'Testing',
  'Completed',
  'Blocked'
];

export const taskPriorities = ['Low', 'Medium', 'High', 'Urgent'];
