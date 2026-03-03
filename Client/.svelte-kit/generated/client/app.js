export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25')
];

export const server_loads = [];

export const dictionary = {
		"/(auth)": [17,[3]],
		"/(admin)/admin/dashboard": [6,[2]],
		"/(admin)/admin/profile": [7,[2]],
		"/(admin)/admin/projects": [8,[2]],
		"/(admin)/admin/projects/new": [10,[2]],
		"/(admin)/admin/projects/[id]": [9,[2]],
		"/(admin)/admin/reports": [11,[2]],
		"/(admin)/admin/tasks": [12,[2]],
		"/(admin)/admin/tasks/new": [14,[2]],
		"/(admin)/admin/tasks/[id]": [13,[2]],
		"/(admin)/admin/team": [15,[2]],
		"/(admin)/admin/team/[id]": [16,[2]],
		"/(employee)/employee/dashboard": [20,[4]],
		"/(employee)/employee/profile": [21,[4]],
		"/(employee)/employee/projects": [22,[4]],
		"/(employee)/employee/tasks": [23,[4]],
		"/(employee)/employee/timesheet": [24,[4]],
		"/(auth)/login/admin": [18,[3]],
		"/(auth)/login/employee": [19,[3]],
		"/(superadmin)/superadmin": [25,[5]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';