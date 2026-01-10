<script>
           import '../../../app.css';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fly, fade, scale } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  let showUserMenu = false;
  let showMobileMenu = false;
  let isMobile = false;
  
  // User data
  let user = {
    name: 'John Doe',
    role: 'Developer',
    avatar: 'JD',
    email: 'john@example.com',
    notifications: 5
  };

  const navItems = [
    { 
      path: '/employee/dashboard', 
      label: 'Dashboard',
      svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>'
    },
    { 
      path: '/employee/tasks', 
      label: 'Tasks',
      svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>'
    },
    { 
      path: '/employee/projects', 
      label: 'Projects',
      svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>'
    },
    { 
      path: '/employee/timesheet', 
      label: 'Timesheet',
      svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    },
    { 
      path: '/employee/more', 
      label: 'More',
      svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>'
    }
  ];

  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  function checkMobile() {
    isMobile = window.innerWidth < 1024;
  }

  function isActive(path) {
    if (path === '/employee/more') {
      return ['/employee/profile', '/employee/settings'].some(p => $page.url.pathname.startsWith(p));
    }
    return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
  }

  function toggleUserMenu() {
    showUserMenu = !showUserMenu;
    showMobileMenu = false;
  }

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
    showUserMenu = false;
  }

  function closeMenus() {
    showUserMenu = false;
    showMobileMenu = false;
  }

  function handleMoreClick() {
    if (isMobile) {
      showMobileMenu = true;
    }
  }

  function logout() {
    goto('/login');
  }
</script>

<svelte:window on:click={closeMenus} />

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
  
  <!-- Top Navigation Bar -->
  <nav class="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-b-2 border-neutral-200 dark:border-neutral-800 shadow-xl">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        
        <!-- Logo/Brand -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div>
            <h1 class="text-base sm:text-lg lg:text-xl font-black text-neutral-900 dark:text-white">TaskManager</h1>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold hidden sm:block">Employee Portal</p>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-2">
          {#each navItems.slice(0, 4) as item}
            <a
              href={item.path}
              class="px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 {
                isActive(item.path)
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {@html item.svg}
              </svg>
              {item.label}
            </a>
          {/each}
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Notifications -->
          <button class="relative p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            {#if user.notifications > 0}
              <span class="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] bg-error-600 text-white text-[10px] sm:text-xs font-black rounded-full flex items-center justify-center px-1">
                {user.notifications}
              </span>
            {/if}
          </button>

          <!-- User Menu (Desktop Only) -->
          <div class="relative hidden lg:block">
            <button
              on:click|stopPropagation={toggleUserMenu}
              class="flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
                {user.avatar}
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{user.name}</p>
                <p class="text-xs text-neutral-600 dark:text-neutral-400">{user.role}</p>
              </div>
              <svg class="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {#if showUserMenu}
              <div
                class="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 py-2 z-50"
                transition:fly={{ y: -10, duration: 200 }}
                on:click|stopPropagation
              >
                <div class="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <p class="text-sm font-bold text-neutral-900 dark:text-white">{user.name}</p>
                  <p class="text-xs text-neutral-600 dark:text-neutral-400">{user.email}</p>
                </div>
                
                <a href="/employee/profile" class="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all">
                  <svg class="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">My Profile</span>
                </a>
                
                <a href="/employee/settings" class="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all">
                  <svg class="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">Settings</span>
                </a>
                
                <button
                  on:click={logout}
                  class="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all border-t border-neutral-200 dark:border-neutral-700 mt-2"
                >
                  <svg class="w-5 h-5 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span class="text-sm font-semibold text-error-700 dark:text-error-400">Logout</span>
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="pt-14 sm:pt-16 pb-20 lg:pb-8">
    <slot />
  </main>

  <!-- Enhanced Bottom Navigation (Mobile Only) -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t-2 border-neutral-200 dark:border-neutral-800 shadow-2xl">
    <div class="grid grid-cols-5 gap-0.5 px-1 py-1.5 safe-bottom">
      {#each navItems as item, index}
        {#if index < 4}
          <a
            href={item.path}
            class="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all relative {
              isActive(item.path)
                ? 'text-primary-700 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-800'
            }"
          >
            {#if isActive(item.path)}
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-full"></div>
            {/if}
            <div class="relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {@html item.svg}
              </svg>
              {#if item.path === '/employee/tasks'}
                <span class="absolute -top-1 -right-1 w-4 h-4 bg-error-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  3
                </span>
              {/if}
            </div>
            <span class="text-[10px] font-bold truncate w-full text-center leading-tight">{item.label}</span>
          </a>
        {:else}
          <button
            on:click|stopPropagation={toggleMobileMenu}
            class="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all relative {
              showMobileMenu || isActive(item.path)
                ? 'text-primary-700 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-800'
            }"
          >
            {#if showMobileMenu || isActive(item.path)}
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-full"></div>
            {/if}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {@html item.svg}
            </svg>
            <span class="text-[10px] font-bold truncate w-full text-center leading-tight">{item.label}</span>
          </button>
        {/if}
      {/each}
    </div>
  </nav>

  <!-- Mobile More Menu (Bottom Sheet) -->
  {#if showMobileMenu}
    <div
      class="lg:hidden fixed inset-0 z-50"
      on:click={closeMenus}
      transition:fade={{ duration: 200 }}
    >
      <div class="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"></div>
      <div
        class="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl border-t-2 border-neutral-200 dark:border-neutral-800 max-h-[80vh] overflow-y-auto"
        on:click|stopPropagation
        transition:fly={{ y: 300, duration: 300 }}
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
        </div>

        <!-- User Info -->
        <div class="px-4 py-4 border-b-2 border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-lg font-black shadow-lg">
              {user.avatar}
            </div>
            <div>
              <p class="text-base font-black text-neutral-900 dark:text-white">{user.name}</p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">{user.email}</p>
              <p class="text-xs text-primary-600 dark:text-primary-400 font-bold mt-0.5">{user.role}</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="p-2">
          <a
            href="/employee/profile"
            on:click={closeMenus}
            class="flex items-center gap-4 px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-all mb-1"
          >
            <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-700 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-base font-bold text-neutral-900 dark:text-white">My Profile</p>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">View and edit your profile</p>
            </div>
          </a>

          <a
            href="/employee/settings"
            on:click={closeMenus}
            class="flex items-center gap-4 px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-all mb-1"
          >
            <div class="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary-700 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-base font-bold text-neutral-900 dark:text-white">Settings</p>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">App preferences and options</p>
            </div>
          </a>

          <a
            href="/employee/notifications"
            on:click={closeMenus}
            class="flex items-center gap-4 px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-all mb-1"
          >
            <div class="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center relative">
              <svg class="w-6 h-6 text-accent-700 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {#if user.notifications > 0}
                <span class="absolute top-0 right-0 w-5 h-5 bg-error-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {user.notifications}
                </span>
              {/if}
            </div>
            <div>
              <p class="text-base font-bold text-neutral-900 dark:text-white">Notifications</p>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">View all notifications</p>
            </div>
          </a>

          <a
            href="/employee/help"
            on:click={closeMenus}
            class="flex items-center gap-4 px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-all mb-1"
          >
            <div class="w-12 h-12 rounded-xl bg-info-100 dark:bg-info-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-info-700 dark:text-info-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-base font-bold text-neutral-900 dark:text-white">Help & Support</p>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">Get help and support</p>
            </div>
          </a>

          <button
            on:click={() => { logout(); closeMenus(); }}
            class="w-full flex items-center gap-4 px-4 py-4 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-2xl transition-all mt-2 border-t-2 border-neutral-200 dark:border-neutral-800"
          >
            <div class="w-12 h-12 rounded-xl bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-error-700 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="text-base font-bold text-error-700 dark:text-error-400">Logout</p>
              <p class="text-xs text-error-600 dark:text-error-500">Sign out from your account</p>
            </div>
          </button>
        </div>

        <div class="h-6"></div>
      </div>
    </div>
  {/if}
</div>

<style>
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
