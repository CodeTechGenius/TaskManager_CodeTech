<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';

  let isVisible = false;

  onMount(() => {
    // Redirect if already logged in
    if ($authStore) {
      if ($authStore.role === 'admin') {
        goto('/');
      } else {
        goto('/');
      }
    }

    // Fade in animation
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  const features = [
    {
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      title: 'Tech Stack',
      description: 'Define your technology stack for each project'
    },
    {
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      title: 'Task Management',
      description: 'Track progress with real-time updates'
    },
    {
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      title: 'Team Collaboration',
      description: 'Manage employees and track performance'
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'Analytics',
      description: 'Detailed reports and insights'
    },
    {
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      title: 'Git Integration',
      description: 'Track commits and deployments'
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Time Tracking',
      description: 'Monitor time spent on tasks'
    }
  ];

  let currentStat = 0;
  const stats = [
    { label: 'Projects', value: '500+' },
    { label: 'Teams', value: '1000+' },
    { label: 'Tasks Completed', value: '50K+' }
  ];

  onMount(() => {
    const interval = setInterval(() => {
      currentStat = (currentStat + 1) % stats.length;
    }, 3000);

    return () => clearInterval(interval);
  });
</script>

<!-- Hero Section -->
<div class="relative min-h-screen overflow-hidden" class:opacity-100={isVisible} class:opacity-0={!isVisible} style="transition: opacity 0.6s ease-out;">
  <!-- Animated Background -->
  <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-800 to-primary-600">
    <!-- Animated Blobs -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>

  <!-- Grid Pattern Overlay -->
  <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px); background-size: 50px 50px;"></div>

  <!-- Navigation -->
  <nav class="relative z-20 px-4 sm:px-6 py-4 sm:py-6">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/30">
          <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <span class="text-xl sm:text-2xl font-bold text-white">Task Manager Pro</span>
      </div>
    </div>
  </nav>

  <!-- Hero Content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
    <div class="text-center max-w-4xl mx-auto">
      <!-- Animated Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm mb-6 sm:mb-8 animate-pulse">
        <span class="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
        <span class="font-medium">New: Real-time Collaboration</span>
      </div>

      <!-- Main Heading -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
        Manage Projects
        <span class="block mt-2 bg-gradient-to-r from-yellow-200 via-secondary-200 to-purple-200 bg-clip-text text-transparent">
          Like a Pro
        </span>
      </h1>

      <p class="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 leading-relaxed px-4 max-w-3xl mx-auto">
        Complete task management with tech stack tracking, team collaboration, and real-time progress monitoring
      </p>

      <!-- CTA Buttons - Mobile Optimized -->
  <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
  <button
    on:click={() => goto('/login/admin')}
    class="group relative px-6 sm:px-8 py-4 sm:py-5 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all text-base sm:text-lg overflow-hidden"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
    <div class="relative flex items-center justify-center gap-2 sm:gap-3">
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <span>Admin Login</span>
      <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
      </svg>
    </div>
  </button>

  <button
    on:click={() => goto('/login/employee')}
    class="group px-6 sm:px-8 py-4 sm:py-5 bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-2xl transition-all text-base sm:text-lg"
  >
    <div class="flex items-center justify-center gap-2 sm:gap-3">
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
      <span>Employee Login</span>
      <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
      </svg>
    </div>
  </button>
</div>

      <!-- Animated Stats Counter -->
      <div class="flex flex-wrap justify-center gap-4 sm:gap-8 px-4">
        {#each stats as stat, i}
          <div class="text-center transform transition-all duration-500" class:scale-110={currentStat === i} class:scale-100={currentStat !== i}>
            <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
            <div class="text-xs sm:text-sm text-white/80">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
    <svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
    </svg>
  </div>
</div>

<!-- Features Section -->
<section class="py-12 sm:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12 sm:mb-16">
      <div class="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
        FEATURES
      </div>
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Everything You Need
      </h2>
      <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Powerful tools to streamline your workflow
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {#each features as feature, i}
        <div class="group card hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer" style="animation-delay: {i * 100}ms;">
          <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={feature.icon}/>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {feature.title}
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Tech Stack Section -->
<section class="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800 transition-colors">
  <div class="max-w-7xl mx-auto text-center">
    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12">
      Built With Modern Technologies
    </h3>
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
      {#each [
        { name: 'SvelteKit', color: 'from-orange-500 to-red-500' },
        { name: 'Tailwind CSS', color: 'from-cyan-500 to-blue-500' },
        { name: 'MongoDB', color: 'from-green-500 to-emerald-500' },
        { name: 'Node.js', color: 'from-lime-500 to-green-600' }
      ] as tech}
        <div class="px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-full text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform cursor-pointer shadow-lg">
          <span class="bg-gradient-to-r {tech.color} bg-clip-text text-transparent">
            {tech.name}
          </span>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-primary-800  to-secondary-600 relative overflow-hidden">
  <div class="absolute inset-0 bg-black/10"></div>
  <div class="max-w-4xl mx-auto text-center relative z-10">
    <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
      Ready to Get Started?
    </h2>
    <p class="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10">
      Choose your role and start managing projects efficiently
    </p>
   <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
  <button
    on:click={() => goto('/login/admin')}
    class="px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all text-base sm:text-lg hover:scale-105"
  >
    Admin Login
  </button>
  <button
    on:click={() => goto('/login/employee')}
    class="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all text-base sm:text-lg"
  >
    Employee Login
  </button>
</div>
  </div>
</section>

<!-- Footer -->
<footer class="py-8 sm:py-12 px-4 sm:px-6 bg-gray-900 dark:bg-black text-gray-400 transition-colors">
  <div class="max-w-7xl mx-auto text-center">
    <div class="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <span class="text-lg sm:text-xl font-bold text-white">Task Manager Pro</span>
    </div>
    <p class="mb-3 sm:mb-4 text-sm sm:text-base">Built with SvelteKit & Tailwind CSS</p>
    <p class="text-xs sm:text-sm">© 2026 Task Manager Pro. All rights reserved.</p>
  </div>
</footer>

<style>
  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>
