
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
		RouteId(): "/" | "/admin" | "/admin/dashboard" | "/login" | "/login/admin" | "/login/admin/dashboard" | "/login/employee";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/dashboard": Record<string, never>;
			"/login": Record<string, never>;
			"/login/admin": Record<string, never>;
			"/login/admin/dashboard": Record<string, never>;
			"/login/employee": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/dashboard" | "/admin/dashboard/" | "/login" | "/login/" | "/login/admin" | "/login/admin/" | "/login/admin/dashboard" | "/login/admin/dashboard/" | "/login/employee" | "/login/employee/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/Logo4.png" | "/robots.txt" | string & {};
	}
}