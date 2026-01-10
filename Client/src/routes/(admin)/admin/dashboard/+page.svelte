<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let stats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    productivity: 0,
    revenue: 0,
    expenses: 0
  };

  let recentProjects = [];
  let recentActivities = [];
  let topPerformers = [];
  let upcomingDeadlines = [];
  let taskDistribution = [];
  let loading = true;

  onMount(async () => {
    await loadDashboardData();
  });

  async function loadDashboardData() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      stats = {
        totalProjects: 24,
        activeProjects: 18,
        completedProjects: 6,
        totalEmployees: 45,
        activeEmployees: 38,
        totalTasks: 156,
        completedTasks: 89,
        inProgressTasks: 52,
        pendingTasks: 15,
        productivity: 78,
        revenue: 450000,
        expenses: 280000
      };

      recentProjects = [
        { 
          id: 1, 
          name: 'E-commerce Platform', 
          status: 'active', 
          progress: 75, 
          tech: ['SvelteKit', 'MongoDB', 'Tailwind'], 
          team: 5,
          dueDate: '2026-02-15',
          priority: 'high',
          budget: 50000
        },
        { 
          id: 2, 
          name: 'Mobile Banking App', 
          status: 'active', 
          progress: 60, 
          tech: ['React Native', 'PostgreSQL'], 
          team: 4,
          dueDate: '2026-03-01',
          priority: 'urgent',
          budget: 80000
        },
        { 
          id: 3, 
          name: 'CRM Dashboard', 
          status: 'active', 
          progress: 45, 
          tech: ['Vue.js', 'MySQL'], 
          team: 6,
          dueDate: '2026-02-28',
          priority: 'medium',
          budget: 60000
        },
        { 
          id: 4, 
          name: 'AI Chatbot', 
          status: 'completed', 
          progress: 100, 
          tech: ['Python', 'TensorFlow'], 
          team: 3,
          dueDate: '2026-01-20',
          priority: 'high',
          budget: 35000
        }
      ];

      recentActivities = [
        { id: 1, user: 'John Doe', avatar: 'JD', action: 'completed task', item: 'User Authentication Module', time: '5 min ago', type: 'success' },
        { id: 2, user: 'Sarah Smith', avatar: 'SS', action: 'updated project', item: 'E-commerce Platform', time: '15 min ago', type: 'info' },
        { id: 3, user: 'Mike Johnson', avatar: 'MJ', action: 'created task', item: 'Payment Gateway Integration', time: '1 hour ago', type: 'warning' },
        { id: 4, user: 'Emma Wilson', avatar: 'EW', action: 'commented on', item: 'Mobile App Design Review', time: '2 hours ago', type: 'info' },
        { id: 5, user: 'Alex Brown', avatar: 'AB', action: 'pushed code to', item: 'API Development Branch', time: '3 hours ago', type: 'success' }
      ];

      topPerformers = [
        { id: 1, name: 'John Doe', avatar: 'JD', tasks: 28, completed: 26, score: 95, trend: 'up' },
        { id: 2, name: 'Sarah Smith', avatar: 'SS', tasks: 24, completed: 22, score: 92, trend: 'up' },
        { id: 3, name: 'Mike Johnson', avatar: 'MJ', tasks: 22, completed: 19, score: 88, trend: 'down' },
        { id: 4, name: 'Emma Wilson', avatar: 'EW', tasks: 20, completed: 17, score: 85, trend: 'up' }
      ];

      upcomingDeadlines = [
        { id: 1, project: 'E-commerce Platform', task: 'Payment Integration', dueDate: '2026-01-12', priority: 'urgent', assignee: 'John Doe' },
        { id: 2, project: 'Mobile Banking App', task: 'Security Audit', dueDate: '2026-01-15', priority: 'high', assignee: 'Sarah Smith' },
        { id: 3, project: 'CRM Dashboard', task: 'API Documentation', dueDate: '2026-01-18', priority: 'medium', assignee: 'Mike Johnson' }
      ];

      taskDistribution = [
        { status: 'Completed', count: 89, color: 'from-success-400 to-success-600', percentage: 57 },
        { status: 'In Progress', count: 52, color: 'from-info-400 to-info-600', percentage: 33 },
        { status: 'Pending', count: 15, color: 'from-warning-400 to-warning-600', percentage: 10 }
      ];

      loading = false;
    } catch (error) {
      console.error('Error loading dashboard:', error);
      loading = false;
    }
  }

  function getStatusColor(status) {
    const colors = {
      active: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
      completed: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
      'on-hold': 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
      planning: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
    };
    return colors[status] || colors.planning;
  }

  function getPriorityColor(priority) {
    const colors = {
      urgent: 'bg-error-50 text-error-700 border-error-300 dark:bg-error-950/50 dark:text-error-400 dark:border-error-800',
      high: 'bg-warning-50 text-warning-700 border-warning-300 dark:bg-warning-950/50 dark:text-warning-400 dark:border-warning-800',
      medium: 'bg-info-50 text-info-700 border-info-300 dark:bg-info-950/50 dark:text-info-400 dark:border-info-800',
      low: 'bg-neutral-50 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600'
    };
    return colors[priority] || colors.medium;
  }

  function getActivityIcon(type) {
    const icons = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    };
    return icons[type] || icons.info;
  }

  function getActivityColor(type) {
    const colors = {
      success: 'text-success-700 bg-success-100 dark:bg-success-900/30 dark:text-success-400',
      info: 'text-info-700 bg-info-100 dark:bg-info-900/30 dark:text-info-400',
      warning: 'text-warning-700 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400'
    };
    return colors[type] || colors.info;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function getDaysUntil(date) {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
</script>

<!-- Main Content -->
<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
    
    <!-- Welcome Hero Banner - Desktop Only -->
    <div class="hidden lg:block relative rounded-3xl shadow-2xl overflow-hidden">
      <!-- Background with Gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div class="relative p-10 text-white">
        <div class="flex items-center justify-between gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl">
                <span class="text-4xl">👋</span>
              </div>
              <div>
                <h1 class="text-4xl font-black tracking-tight">Welcome back, Admin!</h1>
                <p class="text-primary-100 text-base font-medium mt-1">
                  Here's what's happening with your business today
                </p>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <div class="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                <span class="text-sm font-semibold">{stats.inProgressTasks} Tasks Active</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <div class="w-2 h-2 bg-info-400 rounded-full animate-pulse"></div>
                <span class="text-sm font-semibold">{stats.activeProjects} Projects Running</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <div class="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                <span class="text-sm font-semibold">{stats.productivity}% Productivity</span>
              </div>
            </div>
          </div>
          
          <button
            on:click={() => goto('/admin/projects/new')}
            class="px-8 py-4 bg-white hover:bg-neutral-50 text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group transform hover:scale-105"
            aria-label="Create new project"
          >
            <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            <span>New Project</span>
          </button>
        </div>
        
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-4 gap-4 mt-8">
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <div class="flex items-center justify-between mb-2">
              <p class="text-white/80 text-sm font-semibold">Active Projects</p>
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black group-hover:scale-110 transition-transform">{stats.activeProjects}</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <div class="flex items-center justify-between mb-2">
              <p class="text-white/80 text-sm font-semibold">Team Members</p>
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black group-hover:scale-110 transition-transform">{stats.activeEmployees}</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <div class="flex items-center justify-between mb-2">
              <p class="text-white/80 text-sm font-semibold">Tasks Today</p>
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black group-hover:scale-110 transition-transform">{stats.inProgressTasks}</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <div class="flex items-center justify-between mb-2">
              <p class="text-white/80 text-sm font-semibold">Completion</p>
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black group-hover:scale-110 transition-transform">{stats.productivity}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Welcome Card -->
    <div class="lg:hidden relative rounded-3xl shadow-xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-600"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div class="relative p-6 text-white">
        <!-- Greeting Section -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-xl">
            <span class="text-3xl">👋</span>
          </div>
          <div>
            <h2 class="text-2xl font-black">Welcome back!</h2>
            <p class="text-primary-100 text-sm font-semibold">Admin Dashboard</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <p class="text-2xl font-black">{stats.activeProjects}</p>
            <p class="text-xs text-white/80 font-semibold">Projects</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <p class="text-2xl font-black">{stats.inProgressTasks}</p>
            <p class="text-xs text-white/80 font-semibold">Tasks</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <p class="text-2xl font-black">{stats.productivity}%</p>
            <p class="text-xs text-white/80 font-semibold">Progress</p>
          </div>
        </div>

        <!-- Action Button -->
        <button
          on:click={() => goto('/admin/projects/new')}
          class="w-full py-3 bg-white hover:bg-neutral-50 text-primary-700 font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Create New Project</span>
        </button>
      </div>
    </div>

    {#if loading}
      <div class="flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-20 h-20">
            <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400 font-bold text-lg">Loading your dashboard...</p>
        </div>
      </div>
    {:else}
      
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Projects Card -->
        <div class="group bg-white dark:bg-neutral-800 rounded-3xl shadow-xl hover:shadow-2xl p-6 border-2 border-neutral-200 dark:border-neutral-700 relative overflow-hidden transition-all hover:-translate-y-2 cursor-pointer">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <span class="text-xs font-bold text-success-700 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-3 py-1.5 rounded-full">+12%</span>
            </div>
            <h3 class="text-4xl font-black text-neutral-900 dark:text-white mb-2">{stats.totalProjects}</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 font-bold">Total Projects</p>
            <div class="mt-3 flex items-center gap-2">
              <div class="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div class="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-500" style="width: {(stats.completedProjects / stats.totalProjects) * 100}%"></div>
              </div>
              <span class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{stats.completedProjects} Done</span>
            </div>
          </div>
        </div>

        <!-- Total Employees Card -->
        <div class="group bg-white dark:bg-neutral-800 rounded-3xl shadow-xl hover:shadow-2xl p-6 border-2 border-neutral-200 dark:border-neutral-700 relative overflow-hidden transition-all hover:-translate-y-2 cursor-pointer">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-400/20 to-secondary-600/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <span class="text-xs font-bold text-success-700 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-3 py-1.5 rounded-full">+5%</span>
            </div>
            <h3 class="text-4xl font-black text-neutral-900 dark:text-white mb-2">{stats.totalEmployees}</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 font-bold">Team Members</p>
            <div class="mt-3 flex items-center -space-x-2">
              {#each ['JD', 'SS', 'MJ', 'EW', 'AB'] as avatar, i}
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {avatar}
                </div>
              {/each}
              <div class="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 text-xs font-bold">
                +{stats.totalEmployees - 5}
              </div>
            </div>
          </div>
        </div>

        <!-- Total Tasks Card -->
        <div class="group bg-white dark:bg-neutral-800 rounded-3xl shadow-xl hover:shadow-2xl p-6 border-2 border-neutral-200 dark:border-neutral-700 relative overflow-hidden transition-all hover:-translate-y-2 cursor-pointer">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success-400/20 to-success-600/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <span class="text-xs font-bold text-success-700 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-3 py-1.5 rounded-full">+8%</span>
            </div>
            <h3 class="text-4xl font-black text-neutral-900 dark:text-white mb-2">{stats.totalTasks}</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 font-bold">Total Tasks</p>
            <div class="mt-3 flex items-center gap-2 text-xs font-semibold">
              <span class="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 rounded-full">{stats.completedTasks} Done</span>
              <span class="px-3 py-1 bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400 rounded-full">{stats.inProgressTasks} Active</span>
            </div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="group bg-white dark:bg-neutral-800 rounded-3xl shadow-xl hover:shadow-2xl p-6 border-2 border-neutral-200 dark:border-neutral-700 relative overflow-hidden transition-all hover:-translate-y-2 cursor-pointer">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-400/20 to-accent-600/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-bold text-success-700 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-3 py-1.5 rounded-full">+15%</span>
            </div>
            <h3 class="text-4xl font-black text-neutral-900 dark:text-white mb-2">{formatCurrency(stats.revenue)}</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 font-bold">Total Revenue</p>
            <p class="mt-3 text-xs font-semibold text-success-700 dark:text-success-400">
              Profit: {formatCurrency(stats.revenue - stats.expenses)}
            </p>
          </div>
        </div>
      </div>

      <!-- Task Distribution Chart -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-3">
            <div class="w-2 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
            Task Distribution
          </h2>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl font-bold text-sm hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-all">
              This Week
            </button>
            <button class="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-xl font-semibold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all">
              This Month
            </button>
          </div>
        </div>
        
        <div class="space-y-6">
          {#each taskDistribution as task}
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-4 h-4 rounded-full bg-gradient-to-r {task.color} shadow-lg"></div>
                  <span class="text-base font-bold text-neutral-700 dark:text-neutral-300">{task.status}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">{task.count} tasks</span>
                  <span class="text-lg font-black text-neutral-900 dark:text-white min-w-[4rem] text-right">{task.percentage}%</span>
                </div>
              </div>
              <div class="relative w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-4 overflow-hidden shadow-inner">
                <div class="absolute inset-0 bg-gradient-to-r {task.color} h-4 rounded-full transition-all duration-700 ease-out" style="width: {task.percentage}%">
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer-animation"></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
    {/if}
  </div>
</div>

<style>
  /* Shimmer animation */
  .shimmer-animation {
    animation: shimmer 2.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
