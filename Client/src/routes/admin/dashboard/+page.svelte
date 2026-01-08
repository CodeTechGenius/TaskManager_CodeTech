<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';

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
  let selectedPeriod = '7days';

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
        { id: 5, user: 'Alex Brown', avatar: 'AB', action: 'pushed code to', item: 'API Development Branch', time: '3 hours ago', type: 'success' },
        { id: 6, user: 'Lisa Garcia', avatar: 'LG', action: 'started sprint', item: 'Q1 2026 Development Cycle', time: '4 hours ago', type: 'warning' }
      ];

      topPerformers = [
        { id: 1, name: 'John Doe', avatar: 'JD', tasks: 28, completed: 26, score: 95, trend: 'up' },
        { id: 2, name: 'Sarah Smith', avatar: 'SS', tasks: 24, completed: 22, score: 92, trend: 'up' },
        { id: 3, name: 'Mike Johnson', avatar: 'MJ', tasks: 22, completed: 19, score: 88, trend: 'down' },
        { id: 4, name: 'Emma Wilson', avatar: 'EW', tasks: 20, completed: 17, score: 85, trend: 'up' },
        { id: 5, name: 'Alex Brown', avatar: 'AB', tasks: 19, completed: 16, score: 82, trend: 'up' }
      ];

      upcomingDeadlines = [
        { id: 1, project: 'E-commerce Platform', task: 'Payment Integration', dueDate: '2026-01-08', priority: 'urgent', assignee: 'John Doe' },
        { id: 2, project: 'Mobile Banking App', task: 'Security Audit', dueDate: '2026-01-10', priority: 'high', assignee: 'Sarah Smith' },
        { id: 3, project: 'CRM Dashboard', task: 'API Documentation', dueDate: '2026-01-12', priority: 'medium', assignee: 'Mike Johnson' },
        { id: 4, project: 'AI Chatbot', task: 'Testing & QA', dueDate: '2026-01-15', priority: 'high', assignee: 'Emma Wilson' }
      ];

      taskDistribution = [
        { status: 'Completed', count: 89, color: 'bg-green-500', percentage: 57 },
        { status: 'In Progress', count: 52, color: 'bg-blue-500', percentage: 33 },
        { status: 'Pending', count: 15, color: 'bg-yellow-500', percentage: 10 }
      ];

      loading = false;
    } catch (error) {
      console.error('Error loading dashboard:', error);
      loading = false;
    }
  }

  function getStatusColor(status) {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'on-hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      planning: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || colors.planning;
  }

  function getPriorityColor(priority) {
    const colors = {
      urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
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
      success: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      info: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
    };
    return colors[type] || colors.info;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  function getDaysUntil(date) {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
</script>

<div class="p-4 sm:p-6 space-y-6">
  <!-- Welcome Header -->
  <div class="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl shadow-lg p-6 sm:p-8 text-white relative overflow-hidden">
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
    <div class="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
    <div class="relative z-10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {$authStore?.name || 'Admin'}! 👋
          </h1>
          <p class="text-white/90 text-sm sm:text-base">
            Here's what's happening with your projects today. You have {stats.inProgressTasks} tasks in progress.
          </p>
        </div>
        <div class="flex gap-3">
          <button
            on:click={() => goto('/admin/projects')}
            class="px-4 sm:px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-xl font-semibold transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="hidden sm:inline">New Project</span>
          </button>
        </div>
      </div>
      
      <!-- Quick Stats in Header -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p class="text-white/80 text-xs font-medium mb-1">Active Projects</p>
          <p class="text-2xl font-bold">{stats.activeProjects}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p class="text-white/80 text-xs font-medium mb-1">Team Members</p>
          <p class="text-2xl font-bold">{stats.activeEmployees}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p class="text-white/80 text-xs font-medium mb-1">Tasks Today</p>
          <p class="text-2xl font-bold">{stats.inProgressTasks}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p class="text-white/80 text-xs font-medium mb-1">Completion</p>
          <p class="text-2xl font-bold">{stats.productivity}%</p>
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
          <div class="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard...</p>
      </div>
    </div>
  {:else}
    <!-- Main Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Total Projects -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <span class="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">+12%</span>
          </div>
          <h3 class="text-3xl font-bold mb-1">{stats.totalProjects}</h3>
          <p class="text-blue-100 text-sm font-medium">Total Projects</p>
          <div class="flex items-center gap-2 mt-3 text-xs">
            <div class="flex-1 bg-white/20 rounded-full h-1.5">
              <div class="bg-white rounded-full h-1.5" style="width: {(stats.completedProjects / stats.totalProjects) * 100}%"></div>
            </div>
            <span class="text-blue-100">{stats.completedProjects} completed</span>
          </div>
        </div>
      </div>

      <!-- Total Employees -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <span class="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">+5%</span>
          </div>
          <h3 class="text-3xl font-bold mb-1">{stats.totalEmployees}</h3>
          <p class="text-purple-100 text-sm font-medium">Team Members</p>
          <div class="flex items-center gap-2 mt-3">
            <div class="flex -space-x-2">
              {#each ['JD', 'SS', 'MJ', 'EW'] as avatar}
                <div class="w-6 h-6 rounded-full bg-white/30 border-2 border-purple-500 flex items-center justify-center text-xs font-bold">
                  {avatar}
                </div>
              {/each}
            </div>
            <span class="text-purple-100 text-xs">+{stats.totalEmployees - 4} more</span>
          </div>
        </div>
      </div>

      <!-- Total Tasks -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <span class="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">+8%</span>
          </div>
          <h3 class="text-3xl font-bold mb-1">{stats.totalTasks}</h3>
          <p class="text-green-100 text-sm font-medium">Total Tasks</p>
          <div class="flex items-center gap-2 mt-3 text-xs">
            <span class="px-2 py-1 bg-white/20 rounded-full">{stats.completedTasks} done</span>
            <span class="px-2 py-1 bg-white/20 rounded-full">{stats.inProgressTasks} active</span>
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">+15%</span>
          </div>
          <h3 class="text-3xl font-bold mb-1">{formatCurrency(stats.revenue)}</h3>
          <p class="text-orange-100 text-sm font-medium">Total Revenue</p>
          <p class="text-xs text-orange-200 mt-3">Profit: {formatCurrency(stats.revenue - stats.expenses)}</p>
        </div>
      </div>
    </div>

    <!-- Task Distribution -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Task Distribution</h2>
      <div class="space-y-4">
        {#each taskDistribution as task}
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 {task.color} rounded-full"></div>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{task.status}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600 dark:text-gray-400">{task.count} tasks</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">{task.percentage}%</span>
              </div>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div class="{task.color} h-2.5 rounded-full transition-all duration-500" style="width: {task.percentage}%"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Projects - 2 columns -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Recent Projects Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h2>
              <button
                on:click={() => goto('/admin/projects')}
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition"
              >
                View All
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              {#each recentProjects as project}
                <div class="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-600">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition text-base">
                        {project.name}
                      </h3>
                      <div class="flex items-center gap-2 mt-2 flex-wrap">
                        <span class="text-xs px-2.5 py-1 {getStatusColor(project.status)} rounded-full font-medium">
                          {project.status}
                        </span>
                        <span class="text-xs px-2.5 py-1 {getPriorityColor(project.priority)} rounded-full font-medium border">
                          {project.priority}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                          </svg>
                          {project.team} members
                        </span>
                      </div>
                    </div>
                    <span class="text-lg font-bold text-primary-600 dark:text-primary-400">{project.progress}%</span>
                  </div>
                  
                  <!-- Tech Stack -->
                  <div class="flex flex-wrap gap-1.5 mb-3">
                    {#each project.tech as tech}
                      <span class="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600 font-medium">
                        {tech}
                      </span>
                    {/each}
                  </div>

                  <!-- Progress Bar -->
                  <div class="space-y-2">
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div 
                        class="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500 relative overflow-hidden"
                        style="width: {project.progress}%"
                      >
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Due: {project.dueDate}
                      </span>
                      <span class="font-medium">Budget: {formatCurrency(project.budget)}</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Upcoming Deadlines -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              <span class="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-semibold">
                {upcomingDeadlines.length} urgent
              </span>
            </div>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each upcomingDeadlines as deadline}
              <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex flex-col items-center justify-center border border-red-200 dark:border-red-800">
                      <span class="text-lg font-bold text-red-600 dark:text-red-400">
                        {getDaysUntil(deadline.dueDate)}
                      </span>
                      <span class="text-xs text-red-500 dark:text-red-400 font-medium">days</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">{deadline.task}</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{deadline.project}</p>
                    <div class="flex items-center gap-2">
                      <span class="text-xs px-2 py-1 {getPriorityColor(deadline.priority)} rounded-full font-medium border">
                        {deadline.priority}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">→ {deadline.assignee}</span>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Sidebar - 1 column -->
      <div class="space-y-6">
        <!-- Top Performers -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Top Performers</h2>
              <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              {#each topPerformers as performer, index}
                <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer group">
                  <div class="relative flex-shrink-0">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {performer.avatar}
                    </div>
                    {#if index === 0}
                      <div class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow">
                        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                    {/if}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition truncate">
                      {performer.name}
                    </h4>
                    <div class="flex items-center gap-2 mt-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">{performer.completed}/{performer.tasks} tasks</p>
                      {#if performer.trend === 'up'}
                        <svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                      {:else}
                        <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                        </svg>
                      {/if}
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="text-sm font-bold text-green-600 dark:text-green-400">{performer.score}%</div>
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                      <div class="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full" style="width: {performer.score}%"></div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <button
              on:click={() => goto('/admin/employees')}
              class="w-full py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition"
            >
              View All Employees
            </button>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
          </div>
          <div class="max-h-[400px] overflow-y-auto">
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              {#each recentActivities as activity}
                <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 rounded-full {getActivityColor(activity.type)} flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getActivityIcon(activity.type)}/>
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-900 dark:text-white">
                        <span class="font-semibold">{activity.user}</span>
                        <span class="text-gray-600 dark:text-gray-400"> {activity.action} </span>
                        <span class="font-medium">"{activity.item}"</span>
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
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
</style>
