<script>
      import '../../../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  
  let mobileMenuOpen = false;
  let notificationCount = 5;
  
  $: activeTab = $page.url.pathname.split('/').pop() || 'dashboard';
  
  function navigateTo(path) {
    mobileMenuOpen = false;
    goto(`/admin/${path}`);
  }
  
  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<svelte:head>
  <title>Admin Dashboard - Task Manager</title>
</svelte:head>

<!-- Professional Mobile & Desktop Top Navbar -->
<nav class="sticky top-0 z-50 backdrop-blur-xl">
  <!-- Main Navbar -->
  <div class="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 shadow-2xl border-b border-primary-500/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Left: Logo & Menu (Mobile) / Logo & Navigation (Desktop) -->
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button
            on:click={toggleMenu}
            class="lg:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            aria-label="Toggle menu"
          >
            {#if mobileMenuOpen}
              <svg class="w-6 h-6 text-white transform rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            {:else}
              <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            {/if}
          </button>

          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xl border-2 border-white/20">
              <span class="text-2xl">
                  <img 
              src="/Logo4.png" 
              alt="Code Tech Genius Logo" 
              class="w-full h-full object-contain"
            />
              </span>
            </div>
            <div class="flex flex-col">
              <h1 class="text-xl font-black text-white tracking-tight">TaskFlow</h1>
              <p class="text-xs text-primary-100 font-semibold hidden lg:block">Admin Dashboard</p>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-2 ml-8">
            <button
              on:click={() => navigateTo('dashboard')}
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all {activeTab === 'dashboard' ? 'bg-white/20 text-white shadow-lg' : 'text-primary-100 hover:bg-white/10 hover:text-white'}"
            >
              Dashboard
            </button>
            <button
              on:click={() => navigateTo('projects')}
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all {activeTab === 'projects' ? 'bg-white/20 text-white shadow-lg' : 'text-primary-100 hover:bg-white/10 hover:text-white'}"
            >
              Projects
            </button>
            <button
              on:click={() => navigateTo('tasks')}
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all {activeTab === 'tasks' ? 'bg-white/20 text-white shadow-lg' : 'text-primary-100 hover:bg-white/10 hover:text-white'}"
            >
              Tasks
            </button>
            <button
              on:click={() => navigateTo('team')}
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all {activeTab === 'team' ? 'bg-white/20 text-white shadow-lg' : 'text-primary-100 hover:bg-white/10 hover:text-white'}"
            >
              Team
            </button>
            <button
              on:click={() => navigateTo('reports')}
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all {activeTab === 'reports' ? 'bg-white/20 text-white shadow-lg' : 'text-primary-100 hover:bg-white/10 hover:text-white'}"
            >
              Reports
            </button>
          </div>
        </div>
        
        <!-- Right: Actions -->
        <div class="flex items-center gap-2">
          <!-- Search -->
          <button 
            class="hidden sm:flex p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Search"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <!-- Notifications -->
          <button 
            class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl relative hover:scale-105 group"
            aria-label="Notifications"
          >
            <svg class="w-5 h-5 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            {#if notificationCount > 0}
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-primary-700 shadow-lg animate-pulse">
                {notificationCount}
              </span>
            {/if}
          </button>
          
          <!-- Profile -->
          <button class="relative group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
              <span class="text-base font-black text-white">A</span>
            </div>
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-success-400 rounded-full border-2 border-primary-700 shadow-lg"></div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  {#if mobileMenuOpen}
    <div 
      class="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-2xl"
      transition:fly={{ y: -20, duration: 300, easing: cubicOut }}
    >
      <!-- Menu Items -->
      <div class="px-4 py-4 space-y-2 max-h-[65vh] overflow-y-auto">
        <button
          on:click={() => navigateTo('dashboard')}
          class="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/30">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="font-bold text-base">Dashboard</p>
            <p class="text-xs text-white/80">Overview & Analytics</p>
          </div>
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          on:click={() => navigateTo('projects')}
          class="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-accent-400 dark:hover:border-accent-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="font-bold text-neutral-900 dark:text-white text-base">Projects</p>
            <p class="text-xs text-neutral-600 dark:text-neutral-400">Manage Projects</p>
          </div>
          <svg class="w-5 h-5 text-neutral-400 group-hover:text-accent-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          on:click={() => navigateTo('tasks')}
          class="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-success-400 dark:hover:border-success-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="font-bold text-neutral-900 dark:text-white text-base">Tasks</p>
            <p class="text-xs text-neutral-600 dark:text-neutral-400">Track Your Tasks</p>
          </div>
          <svg class="w-5 h-5 text-neutral-400 group-hover:text-success-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          on:click={() => navigateTo('team')}
          class="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-info-400 dark:hover:border-info-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-info-500 to-info-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="font-bold text-neutral-900 dark:text-white text-base">Team</p>
            <p class="text-xs text-neutral-600 dark:text-neutral-400">Team Members</p>
          </div>
          <svg class="w-5 h-5 text-neutral-400 group-hover:text-info-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          on:click={() => navigateTo('reports')}
          class="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-warning-400 dark:hover:border-warning-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="font-bold text-neutral-900 dark:text-white text-base">Reports</p>
            <p class="text-xs text-neutral-600 dark:text-neutral-400">Analytics & Insights</p>
          </div>
          <svg class="w-5 h-5 text-neutral-400 group-hover:text-warning-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Settings & Logout -->
        <div class="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
          <button
            on:click={() => navigateTo('settings')}
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all"
          >
            <svg class="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="font-semibold text-neutral-700 dark:text-neutral-300">Settings</span>
          </button>

          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-error-50 dark:bg-error-950/30 hover:bg-error-100 dark:hover:bg-error-900/40 transition-all text-error-700 dark:text-error-400"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  {/if}
</nav>

<!-- Overlay -->
{#if mobileMenuOpen}
  <div 
    class="lg:hidden fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-40"
    on:click={toggleMenu}
    transition:fade={{ duration: 200 }}
  ></div>
{/if}

<!-- Main Content Slot -->
<slot />

<!-- Professional Mobile Bottom Navigation -->
<nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t-2 border-neutral-200 dark:border-neutral-800 shadow-2xl">
  <div class="safe-area-inset-bottom">
    <div class="grid grid-cols-5 h-20 px-2">
      <button
        on:click={() => navigateTo('dashboard')}
        class="flex flex-col items-center justify-center gap-1 transition-all {activeTab === 'dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'}"
        aria-label="Dashboard"
      >
        <div class="relative">
          {#if activeTab === 'dashboard'}
            <div class="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-2xl scale-150 opacity-50"></div>
          {/if}
          <div class="relative w-12 h-12 flex items-center justify-center {activeTab === 'dashboard' ? 'scale-110' : ''}">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={activeTab === 'dashboard' ? '2.5' : '2'} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
        </div>
        <span class="text-xs font-bold">Home</span>
        {#if activeTab === 'dashboard'}
          <div class="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-full"></div>
        {/if}
      </button>

      <button
        on:click={() => navigateTo('projects')}
        class="flex flex-col items-center justify-center gap-1 transition-all {activeTab === 'projects' ? 'text-accent-600 dark:text-accent-400' : 'text-neutral-500 dark:text-neutral-400'}"
        aria-label="Projects"
      >
        <div class="relative">
          {#if activeTab === 'projects'}
            <div class="absolute inset-0 bg-accent-100 dark:bg-accent-900/30 rounded-2xl scale-150 opacity-50"></div>
          {/if}
          <div class="relative w-12 h-12 flex items-center justify-center {activeTab === 'projects' ? 'scale-110' : ''}">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={activeTab === 'projects' ? '2.5' : '2'} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
        </div>
        <span class="text-xs font-bold">Projects</span>
        {#if activeTab === 'projects'}
          <div class="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-accent-500 to-accent-600 rounded-t-full"></div>
        {/if}
      </button>

      <button
        on:click={() => goto('/admin/projects/new')}
        class="flex flex-col items-center justify-center -mt-6"
        aria-label="Add new"
      >
        <div class="w-16 h-16 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white dark:border-neutral-900 transform hover:scale-110 transition-transform">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
      </button>

      <button
        on:click={() => navigateTo('tasks')}
        class="flex flex-col items-center justify-center gap-1 transition-all {activeTab === 'tasks' ? 'text-success-600 dark:text-success-400' : 'text-neutral-500 dark:text-neutral-400'}"
        aria-label="Tasks"
      >
        <div class="relative">
          {#if activeTab === 'tasks'}
            <div class="absolute inset-0 bg-success-100 dark:bg-success-900/30 rounded-2xl scale-150 opacity-50"></div>
          {/if}
          <div class="relative w-12 h-12 flex items-center justify-center {activeTab === 'tasks' ? 'scale-110' : ''}">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={activeTab === 'tasks' ? '2.5' : '2'} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
        </div>
        <span class="text-xs font-bold">Tasks</span>
        {#if activeTab === 'tasks'}
          <div class="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-success-500 to-success-600 rounded-t-full"></div>
        {/if}
      </button>

      <button
        on:click={() => navigateTo('profile')}
        class="flex flex-col items-center justify-center gap-1 transition-all {activeTab === 'profile' ? 'text-info-600 dark:text-info-400' : 'text-neutral-500 dark:text-neutral-400'}"
        aria-label="Profile"
      >
        <div class="relative">
          {#if activeTab === 'profile'}
            <div class="absolute inset-0 bg-info-100 dark:bg-info-900/30 rounded-2xl scale-150 opacity-50"></div>
          {/if}
          <div class="relative w-12 h-12 flex items-center justify-center {activeTab === 'profile' ? 'scale-110' : ''}">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={activeTab === 'profile' ? '2.5' : '2'} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
        </div>
        <span class="text-xs font-bold">Profile</span>
        {#if activeTab === 'profile'}
          <div class="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-info-500 to-info-600 rounded-t-full"></div>
        {/if}
      </button>
    </div>
  </div>
</nav>

<style>
  /* Smooth transitions globally */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }

  /* Safe area for mobile devices with notch */
  .safe-area-inset-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
