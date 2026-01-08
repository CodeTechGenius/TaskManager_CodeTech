<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { navigating } from '$app/stores';
  
  let darkMode = false;
  let loading = true;
  let progress = 0;

  onMount(() => {
    // Simulate loading with progress
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loading = false;
        }, 300);
      }
    }, 200);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    darkMode = savedTheme === 'dark' || 
               (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    updateTheme();

    return () => clearInterval(interval);
  });

  function updateTheme() {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function toggleTheme() {
    darkMode = !darkMode;
    updateTheme();
  }

  $: isNavigating = $navigating;
</script>

<svelte:head>
  <title>Code Tech Genius Task Manager - Modern Project Management</title>
  <meta name="description" content="Professional task management system for teams" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<!-- Loading Screen -->
{#if loading}
  <div class="fixed inset-0 z-[9999] bg-gradient-to-br from-primary-600 via-primary-800 to-primary-600 flex items-center justify-center">
    <div class="text-center px-4">
      <!-- Logo with Circular Loader -->
      <div class="relative mb-8">
        <div class="w-32 h-32 sm:w-40 sm:h-40 mx-auto relative">
          <!-- Outer rotating ring -->
          <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          
          <!-- Animated circular loader -->
          <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
              stroke-dasharray="283"
              stroke-dashoffset={283 - (283 * progress) / 100}
              class="transition-all duration-300 ease-out"
              style="filter: drop-shadow(0 0 8px rgba(255,255,255,0.5));"
            />
          </svg>
          
          <!-- Logo Image -->
          <div class="absolute inset-2 sm:inset-3 rounded-full overflow-hidden bg-black/40 flex items-center justify-center p-2 sm:p-3 shadow-2xl">
            <img 
              src="/Logo4.png" 
              alt="Code Tech Genius Logo" 
              class="w-full h-full object-contain"
            />
          </div>

          <!-- Pulsing effect -->
          <div class="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
        </div>
      </div>

      <!-- Company Name -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Code Tech Genius
        </h1>
        <h2 class="text-xl sm:text-2xl font-semibold text-white/90">
          Task Manager
        </h2>
      </div>

      <!-- Loading Text -->
      <p class="text-white/80 text-sm sm:text-base mb-6 font-medium">
        Loading your workspace...
      </p>

      <!-- Progress Bar -->
      <div class="max-w-xs sm:max-w-sm mx-auto mb-4">
        <div class="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
          <div 
            class="h-full bg-gradient-to-r from-white via-yellow-200 to-white rounded-full transition-all duration-300 ease-out relative overflow-hidden"
            style="width: {progress}%"
          >
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      <!-- Loading Percentage -->
      <p class="text-white font-semibold text-lg sm:text-xl mb-6">
        {Math.round(progress)}%
      </p>

      <!-- Loading dots animation -->
      <div class="flex gap-2 justify-center">
        <div class="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
        <div class="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
      </div>

      <!-- Small tagline -->
      <p class="text-white/60 text-xs sm:text-sm mt-8 font-light">
        Powered by SvelteKit & Tailwind CSS
      </p>
    </div>
  </div>
{/if}

<!-- Page Transition Loader -->
{#if isNavigating}
  <div class="fixed top-0 left-0 right-0 z-[9998]">
    <div class="h-1 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 animate-pulse"></div>
  </div>
{/if}

<!-- Main Content -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <!-- Theme Toggle Button -->
  <button
    on:click={toggleTheme}
    class="fixed bottom-6 right-6 w-14 h-14 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95"
    aria-label="Toggle theme"
  >
    {#if darkMode}
      <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
      </svg>
    {:else}
      <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
      </svg>
    {/if}
  </button>

  <slot />
</div>

<style>
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce {
    animation: bounce 1s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  @keyframes ping {
    75%, 100% {
      transform: scale(1.1);
      opacity: 0;
    }
  }

  .animate-ping {
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
</style>
