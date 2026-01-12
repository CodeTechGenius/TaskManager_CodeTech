
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(employee)" | "/(auth)" | "/(admin)" | "/" | "/(admin)/admin" | "/(admin)/admin/dashboard" | "/(admin)/admin/profile" | "/(admin)/admin/projects" | "/(admin)/admin/projects/new" | "/(admin)/admin/projects/[id]" | "/(admin)/admin/reports" | "/(admin)/admin/tasks" | "/(admin)/admin/tasks/new" | "/(admin)/admin/tasks/[id]" | "/(admin)/admin/team" | "/(admin)/admin/team/[id]" | "/(employee)/employee" | "/(employee)/employee/dashboard" | "/(employee)/employee/profile" | "/(employee)/employee/projects" | "/(employee)/employee/tasks" | "/(employee)/employee/timesheet" | "/(auth)/login" | "/(auth)/login/admin" | "/(auth)/login/employee";
		RouteParams(): {
			"/(admin)/admin/projects/[id]": { id: string };
			"/(admin)/admin/tasks/[id]": { id: string };
			"/(admin)/admin/team/[id]": { id: string }
		};
		LayoutParams(): {
			"/(employee)": Record<string, never>;
			"/(auth)": Record<string, never>;
			"/(admin)": { id?: string };
			"/": { id?: string };
			"/(admin)/admin": { id?: string };
			"/(admin)/admin/dashboard": Record<string, never>;
			"/(admin)/admin/profile": Record<string, never>;
			"/(admin)/admin/projects": { id?: string };
			"/(admin)/admin/projects/new": Record<string, never>;
			"/(admin)/admin/projects/[id]": { id: string };
			"/(admin)/admin/reports": Record<string, never>;
			"/(admin)/admin/tasks": { id?: string };
			"/(admin)/admin/tasks/new": Record<string, never>;
			"/(admin)/admin/tasks/[id]": { id: string };
			"/(admin)/admin/team": { id?: string };
			"/(admin)/admin/team/[id]": { id: string };
			"/(employee)/employee": Record<string, never>;
			"/(employee)/employee/dashboard": Record<string, never>;
			"/(employee)/employee/profile": Record<string, never>;
			"/(employee)/employee/projects": Record<string, never>;
			"/(employee)/employee/tasks": Record<string, never>;
			"/(employee)/employee/timesheet": Record<string, never>;
			"/(auth)/login": Record<string, never>;
			"/(auth)/login/admin": Record<string, never>;
			"/(auth)/login/employee": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/dashboard" | "/admin/dashboard/" | "/admin/profile" | "/admin/profile/" | "/admin/projects" | "/admin/projects/" | "/admin/projects/new" | "/admin/projects/new/" | `/admin/projects/${string}` & {} | `/admin/projects/${string}/` & {} | "/admin/reports" | "/admin/reports/" | "/admin/tasks" | "/admin/tasks/" | "/admin/tasks/new" | "/admin/tasks/new/" | `/admin/tasks/${string}` & {} | `/admin/tasks/${string}/` & {} | "/admin/team" | "/admin/team/" | `/admin/team/${string}` & {} | `/admin/team/${string}/` & {} | "/employee" | "/employee/" | "/employee/dashboard" | "/employee/dashboard/" | "/employee/profile" | "/employee/profile/" | "/employee/projects" | "/employee/projects/" | "/employee/tasks" | "/employee/tasks/" | "/employee/timesheet" | "/employee/timesheet/" | "/login" | "/login/" | "/login/admin" | "/login/admin/" | "/login/employee" | "/login/employee/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/Logo4.png" | "/favicon.png" | "/robots.txt" | string & {};
	}
}