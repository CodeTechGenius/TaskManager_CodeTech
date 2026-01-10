<script>
  import { onMount } from 'svelte';
  import { fly, fade, scale } from 'svelte/transition';
  
  let loading = true;
  let selectedPeriod = 'month';
  let selectedReportType = 'overview';
  let selectedExportFormat = 'pdf';
  let showExportModal = false;
  let showSuccessMessage = false;
  let successMessage = '';
  let selectedDateRange = {
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  };

  // Report data
  let overviewStats = {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalTasks: 245,
    completedTasks: 189,
    inProgressTasks: 42,
    todoTasks: 14,
    totalTeamMembers: 24,
    activeMembers: 21,
    totalHours: 3840,
    averageTaskCompletion: 77,
    projectSuccessRate: 92,
    onTimeDelivery: 85
  };

  let projectReports = [
    { id: 1, name: 'E-commerce Platform', status: 'active', progress: 75, tasks: 45, completed: 34, team: 8, budget: '₹50,00,000', spent: '₹37,50,000', deadline: '2026-03-15', health: 'good' },
    { id: 2, name: 'Mobile Banking App', status: 'active', progress: 60, tasks: 52, completed: 31, team: 10, budget: '₹75,00,000', spent: '₹45,00,000', deadline: '2026-04-20', health: 'good' },
    { id: 3, name: 'Healthcare Portal', status: 'active', progress: 85, tasks: 38, completed: 32, team: 6, budget: '₹40,00,000', spent: '₹34,00,000', deadline: '2026-02-28', health: 'excellent' },
    { id: 4, name: 'CRM Dashboard', status: 'completed', progress: 100, tasks: 42, completed: 42, team: 7, budget: '₹35,00,000', spent: '₹33,00,000', deadline: '2026-01-05', health: 'excellent' },
    { id: 5, name: 'Real Estate Marketplace', status: 'active', progress: 45, tasks: 48, completed: 22, team: 9, budget: '₹60,00,000', spent: '₹27,00,000', deadline: '2026-05-10', health: 'warning' }
  ];

  let teamReports = [
    { id: 1, name: 'John Doe', role: 'Lead Developer', tasksCompleted: 124, tasksActive: 8, hours: 320, productivity: 95, performance: 'excellent' },
    { id: 2, name: 'Sarah Smith', role: 'Senior Designer', tasksCompleted: 98, tasksActive: 6, hours: 304, productivity: 92, performance: 'excellent' },
    { id: 3, name: 'Mike Johnson', role: 'Backend Developer', tasksCompleted: 156, tasksActive: 10, hours: 336, productivity: 88, performance: 'good' },
    { id: 4, name: 'Emma Wilson', role: 'QA Engineer', tasksCompleted: 87, tasksActive: 7, hours: 320, productivity: 85, performance: 'good' },
    { id: 5, name: 'Alex Brown', role: 'DevOps Engineer', tasksCompleted: 142, tasksActive: 5, hours: 320, productivity: 90, performance: 'excellent' }
  ];

  let taskReports = [
    { priority: 'urgent', total: 12, completed: 8, inProgress: 3, todo: 1, avgTime: '2.5 days' },
    { priority: 'high', total: 58, completed: 45, inProgress: 10, todo: 3, avgTime: '4.2 days' },
    { priority: 'medium', total: 125, completed: 98, inProgress: 20, todo: 7, avgTime: '5.8 days' },
    { priority: 'low', total: 50, completed: 38, inProgress: 9, todo: 3, avgTime: '7.5 days' }
  ];

  let revenueData = [
    { month: 'July 2025', budget: 2500000, spent: 2200000, revenue: 2800000 },
    { month: 'August 2025', budget: 3000000, spent: 2750000, revenue: 3200000 },
    { month: 'September 2025', budget: 2800000, spent: 2600000, revenue: 3100000 },
    { month: 'October 2025', budget: 3200000, spent: 3000000, revenue: 3500000 },
    { month: 'November 2025', budget: 3500000, spent: 3200000, revenue: 3800000 },
    { month: 'December 2025', budget: 4000000, spent: 3800000, revenue: 4500000 },
    { month: 'January 2026', budget: 3800000, spent: 2100000, revenue: 1800000 }
  ];

  let timelineData = [
    { date: '2026-01-06', tasks: 12, completed: 10, hours: 64 },
    { date: '2026-01-07', tasks: 15, completed: 12, hours: 72 },
    { date: '2026-01-08', tasks: 14, completed: 11, hours: 68 },
    { date: '2026-01-09', tasks: 16, completed: 13, hours: 76 },
    { date: '2026-01-10', tasks: 18, completed: 15, hours: 80 }
  ];

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'team', label: 'Team Performance', icon: '👥' },
    { id: 'tasks', label: 'Task Analytics', icon: '✅' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'timeline', label: 'Timeline', icon: '📅' }
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  onMount(async () => {
    await loadReports();
  });

  async function loadReports() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      loading = false;
    } catch (error) {
      console.error('Error loading reports:', error);
      loading = false;
    }
  }

  function getHealthColor(health) {
    const colors = {
      excellent: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
      good: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
      warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
      critical: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
    };
    return colors[health] || colors.good;
  }

  function getPerformanceColor(performance) {
    const colors = {
      excellent: 'from-success-500 to-success-600',
      good: 'from-info-500 to-info-600',
      average: 'from-warning-500 to-warning-600',
      poor: 'from-error-500 to-error-600'
    };
    return colors[performance] || colors.good;
  }

  function getProgressColor(progress) {
    if (progress >= 80) return 'from-success-500 to-success-600';
    if (progress >= 50) return 'from-info-500 to-info-600';
    if (progress >= 25) return 'from-warning-500 to-warning-600';
    return 'from-error-500 to-error-600';
  }

  function getPriorityColor(priority) {
    const colors = {
      urgent: 'text-error-700 bg-error-100 dark:bg-error-900/30 dark:text-error-400',
      high: 'text-warning-700 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400',
      medium: 'text-info-700 bg-info-100 dark:bg-info-900/30 dark:text-info-400',
      low: 'text-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300'
    };
    return colors[priority] || colors.medium;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function openExportModal() {
    showExportModal = true;
  }

  function closeExportModal() {
    showExportModal = false;
  }

  async function exportReport() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess(`Report exported as ${selectedExportFormat.toUpperCase()} successfully!`);
      closeExportModal();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  }

  function showSuccess(message) {
    successMessage = message;
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
    }, 3000);
  }

  function refreshReports() {
    loading = true;
    loadReports();
  }
</script>

<svelte:head>
  <title>Reports - Task Manager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  <div class="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
    
    <!-- Page Header -->
    <div class="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div class="relative p-4 sm:p-6 lg:p-10 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl">
                <span class="text-2xl sm:text-3xl lg:text-4xl">📊</span>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">Reports & Analytics</h1>
                <p class="text-primary-100 text-xs sm:text-sm lg:text-base font-medium mt-1">
                  Track performance and insights
                </p>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <span class="text-lg sm:text-2xl font-black">{overviewStats.totalProjects}</span>
                <span class="text-xs sm:text-sm font-semibold">Projects</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <span class="text-lg sm:text-2xl font-black">{overviewStats.totalTasks}</span>
                <span class="text-xs sm:text-sm font-semibold">Tasks</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <span class="text-lg sm:text-2xl font-black">{overviewStats.totalTeamMembers}</span>
                <span class="text-xs sm:text-sm font-semibold">Team</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <span class="text-lg sm:text-2xl font-black">{overviewStats.projectSuccessRate}%</span>
                <span class="text-xs sm:text-sm font-semibold">Success</span>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2 sm:gap-3">
            <button
              on:click={refreshReports}
              class="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl sm:rounded-2xl border-2 border-white/30 transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span class="hidden sm:inline">Refresh</span>
            </button>
            <button
              on:click={openExportModal}
              class="px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-neutral-50 text-primary-700 font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-16 sm:w-20 h-16 sm:h-20">
            <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400 font-bold text-sm sm:text-lg">Loading reports...</p>
        </div>
      </div>
    {:else}
      
      <!-- Filters -->
      <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-3 sm:p-4 lg:p-6">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <label class="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center">Period:</label>
            <select
              bind:value={selectedPeriod}
              class="px-3 sm:px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {#each periods as period}
                <option value={period.id}>{period.label}</option>
              {/each}
            </select>

            {#if selectedPeriod === 'custom'}
              <input
                type="date"
                bind:value={selectedDateRange.start}
                class="px-3 sm:px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <span class="text-neutral-600 dark:text-neutral-400 font-bold flex items-center">to</span>
              <input
                type="date"
                bind:value={selectedDateRange.end}
                class="px-3 sm:px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            {/if}
          </div>

          <!-- Report Type Tabs -->
          <div class="flex flex-wrap gap-2">
            {#each reportTypes as type}
              <button
                on:click={() => selectedReportType = type.id}
                class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all {
                  selectedReportType === type.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500 scale-105 shadow-lg'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
              >
                <span class="mr-1">{type.icon}</span>
                <span class="hidden sm:inline">{type.label}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Report Content -->
      {#if selectedReportType === 'overview'}
        <!-- Overview Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 text-white">
            <div class="flex items-start justify-between mb-3">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span class="text-2xl">📁</span>
              </div>
              <span class="text-2xl sm:text-3xl font-black">{overviewStats.activeProjects}</span>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white/80">Active Projects</p>
            <p class="text-xs text-white/60 mt-1">of {overviewStats.totalProjects} total</p>
          </div>

          <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 text-white">
            <div class="flex items-start justify-between mb-3">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span class="text-2xl">✅</span>
              </div>
              <span class="text-2xl sm:text-3xl font-black">{overviewStats.completedTasks}</span>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white/80">Completed Tasks</p>
            <p class="text-xs text-white/60 mt-1">{overviewStats.averageTaskCompletion}% completion rate</p>
          </div>

          <div class="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 text-white">
            <div class="flex items-start justify-between mb-3">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span class="text-2xl">👥</span>
              </div>
              <span class="text-2xl sm:text-3xl font-black">{overviewStats.activeMembers}</span>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white/80">Active Members</p>
            <p class="text-xs text-white/60 mt-1">of {overviewStats.totalTeamMembers} team</p>
          </div>

          <div class="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 text-white">
            <div class="flex items-start justify-between mb-3">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span class="text-2xl">⏱️</span>
              </div>
              <span class="text-2xl sm:text-3xl font-black">{overviewStats.totalHours}</span>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white/80">Total Hours</p>
            <p class="text-xs text-white/60 mt-1">this period</p>
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-4">Task Distribution</h3>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">Completed</span>
                  <span class="text-xs sm:text-sm font-black text-success-700 dark:text-success-400">{overviewStats.completedTasks}</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div class="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full" style="width: {(overviewStats.completedTasks / overviewStats.totalTasks) * 100}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">In Progress</span>
                  <span class="text-xs sm:text-sm font-black text-info-700 dark:text-info-400">{overviewStats.inProgressTasks}</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div class="bg-gradient-to-r from-info-500 to-info-600 h-2 rounded-full" style="width: {(overviewStats.inProgressTasks / overviewStats.totalTasks) * 100}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">To Do</span>
                  <span class="text-xs sm:text-sm font-black text-neutral-700 dark:text-neutral-400">{overviewStats.todoTasks}</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div class="bg-gradient-to-r from-neutral-400 to-neutral-500 h-2 rounded-full" style="width: {(overviewStats.todoTasks / overviewStats.totalTasks) * 100}%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-4">Project Health</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 rounded-xl bg-success-50 dark:bg-success-900/20">
                <span class="text-sm font-semibold text-success-700 dark:text-success-400">On Track</span>
                <span class="text-lg font-black text-success-800 dark:text-success-300">5</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl bg-warning-50 dark:bg-warning-900/20">
                <span class="text-sm font-semibold text-warning-700 dark:text-warning-400">At Risk</span>
                <span class="text-lg font-black text-warning-800 dark:text-warning-300">2</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl bg-error-50 dark:bg-error-900/20">
                <span class="text-sm font-semibold text-error-700 dark:text-error-400">Critical</span>
                <span class="text-lg font-black text-error-800 dark:text-error-300">1</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-4">Performance</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Success Rate</span>
                  <span class="text-lg font-black text-primary-700 dark:text-primary-400">{overviewStats.projectSuccessRate}%</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                  <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full" style="width: {overviewStats.projectSuccessRate}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">On-Time Delivery</span>
                  <span class="text-lg font-black text-secondary-700 dark:text-secondary-400">{overviewStats.onTimeDelivery}%</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                  <div class="bg-gradient-to-r from-secondary-500 to-secondary-600 h-3 rounded-full" style="width: {overviewStats.onTimeDelivery}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {:else if selectedReportType === 'projects'}
        <!-- Projects Report -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
          <h3 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-6">Project Reports</h3>
          <div class="space-y-4">
            {#each projectReports as project}
              <div class="p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="text-lg font-black text-neutral-900 dark:text-white">{project.name}</h4>
                      <span class="px-3 py-1 rounded-full text-xs font-bold {getHealthColor(project.health)}">
                        {project.health.toUpperCase()}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-3 text-sm">
                      <span class="text-neutral-600 dark:text-neutral-400 font-semibold">Team: {project.team} members</span>
                      <span class="text-neutral-600 dark:text-neutral-400 font-semibold">Tasks: {project.completed}/{project.tasks}</span>
                      <span class="text-neutral-600 dark:text-neutral-400 font-semibold">Due: {formatDate(project.deadline)}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-3xl font-black text-primary-700 dark:text-primary-400 mb-1">{project.progress}%</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Progress</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div class="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                    <p class="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1">Budget</p>
                    <p class="text-lg font-black text-primary-800 dark:text-primary-300">{project.budget}</p>
                  </div>
                  <div class="p-3 rounded-xl bg-secondary-50 dark:bg-secondary-900/20">
                    <p class="text-xs font-semibold text-secondary-600 dark:text-secondary-500 mb-1">Spent</p>
                    <p class="text-lg font-black text-secondary-800 dark:text-secondary-300">{project.spent}</p>
                  </div>
                </div>

                <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                  <div class="bg-gradient-to-r {getProgressColor(project.progress)} h-3 rounded-full transition-all" style="width: {project.progress}%"></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

      {:else if selectedReportType === 'team'}
        <!-- Team Performance Report -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
          <h3 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-6">Team Performance</h3>
          <div class="space-y-4">
            {#each teamReports as member}
              <div class="p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-black text-neutral-900 dark:text-white">{member.name}</h4>
                    <p class="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{member.role}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-black text-primary-700 dark:text-primary-400">{member.productivity}%</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Productivity</p>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-4">
                  <div class="p-3 rounded-xl bg-success-50 dark:bg-success-900/20 text-center">
                    <p class="text-2xl font-black text-success-700 dark:text-success-400">{member.tasksCompleted}</p>
                    <p class="text-xs font-semibold text-success-600 dark:text-success-500">Completed</p>
                  </div>
                  <div class="p-3 rounded-xl bg-info-50 dark:bg-info-900/20 text-center">
                    <p class="text-2xl font-black text-info-700 dark:text-info-400">{member.tasksActive}</p>
                    <p class="text-xs font-semibold text-info-600 dark:text-info-500">Active</p>
                  </div>
                  <div class="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center">
                    <p class="text-2xl font-black text-primary-700 dark:text-primary-400">{member.hours}</p>
                    <p class="text-xs font-semibold text-primary-600 dark:text-primary-500">Hours</p>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Performance</span>
                    <span class="text-sm font-bold text-primary-700 dark:text-primary-400">{member.performance.toUpperCase()}</span>
                  </div>
                  <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div class="bg-gradient-to-r {getPerformanceColor(member.performance)} h-3 rounded-full" style="width: {member.productivity}%"></div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>

      {:else if selectedReportType === 'tasks'}
        <!-- Task Analytics -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
          <h3 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-6">Task Analytics by Priority</h3>
          <div class="space-y-4">
            {#each taskReports as task}
              <div class="p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700">
                <div class="flex items-center justify-between mb-4">
                  <span class="px-4 py-2 rounded-xl text-sm font-bold {getPriorityColor(task.priority)}">
                    {task.priority.toUpperCase()} PRIORITY
                  </span>
                  <div class="text-right">
                    <p class="text-2xl font-black text-neutral-900 dark:text-white">{task.total}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Total Tasks</p>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-4">
                  <div class="p-3 rounded-xl bg-success-50 dark:bg-success-900/20 text-center">
                    <p class="text-xl font-black text-success-700 dark:text-success-400">{task.completed}</p>
                    <p class="text-xs font-semibold text-success-600 dark:text-success-500">Done</p>
                  </div>
                  <div class="p-3 rounded-xl bg-info-50 dark:bg-info-900/20 text-center">
                    <p class="text-xl font-black text-info-700 dark:text-info-400">{task.inProgress}</p>
                    <p class="text-xs font-semibold text-info-600 dark:text-info-500">Progress</p>
                  </div>
                  <div class="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
                    <p class="text-xl font-black text-neutral-700 dark:text-neutral-300">{task.todo}</p>
                    <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400">To Do</p>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <span class="text-sm font-semibold text-primary-700 dark:text-primary-400">Avg Completion Time</span>
                  <span class="text-lg font-black text-primary-800 dark:text-primary-300">{task.avgTime}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>

      {:else if selectedReportType === 'financial'}
        <!-- Financial Report -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
          <h3 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-6">Financial Overview</h3>
          <div class="space-y-4">
            {#each revenueData as data}
              <div class="p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700">
                <h4 class="text-lg font-black text-neutral-900 dark:text-white mb-4">{data.month}</h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div class="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                    <p class="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1">Budget</p>
                    <p class="text-xl font-black text-primary-800 dark:text-primary-300">{formatCurrency(data.budget)}</p>
                  </div>
                  <div class="p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20">
                    <p class="text-xs font-semibold text-warning-600 dark:text-warning-500 mb-1">Spent</p>
                    <p class="text-xl font-black text-warning-800 dark:text-warning-300">{formatCurrency(data.spent)}</p>
                  </div>
                  <div class="p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
                    <p class="text-xs font-semibold text-success-600 dark:text-success-500 mb-1">Revenue</p>
                    <p class="text-xl font-black text-success-800 dark:text-success-300">{formatCurrency(data.revenue)}</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <div>
                    <div class="flex justify-between mb-1">
                      <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Budget Utilization</span>
                      <span class="text-xs font-black text-neutral-900 dark:text-white">{Math.round((data.spent / data.budget) * 100)}%</span>
                    </div>
                    <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div class="bg-gradient-to-r from-warning-500 to-warning-600 h-2 rounded-full" style="width: {Math.min((data.spent / data.budget) * 100, 100)}%"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between mb-1">
                      <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Profit Margin</span>
                      <span class="text-xs font-black text-success-700 dark:text-success-400">+{formatCurrency(data.revenue - data.spent)}</span>
                    </div>
                    <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div class="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full" style="width: {Math.min(((data.revenue - data.spent) / data.revenue) * 100, 100)}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>

      {:else if selectedReportType === 'timeline'}
        <!-- Timeline Report -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
          <h3 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-6">Activity Timeline</h3>
          <div class="space-y-4">
            {#each timelineData as day}
              <div class="p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-black text-neutral-900 dark:text-white">{formatDate(day.date)}</h4>
                  <span class="px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-bold">
                    {day.hours} hours
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div class="p-3 rounded-xl bg-info-50 dark:bg-info-900/20 text-center">
                    <p class="text-2xl font-black text-info-700 dark:text-info-400">{day.tasks}</p>
                    <p class="text-xs font-semibold text-info-600 dark:text-info-500">Total Tasks</p>
                  </div>
                  <div class="p-3 rounded-xl bg-success-50 dark:bg-success-900/20 text-center">
                    <p class="text-2xl font-black text-success-700 dark:text-success-400">{day.completed}</p>
                    <p class="text-xs font-semibold text-success-600 dark:text-success-500">Completed</p>
                  </div>
                  <div class="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center">
                    <p class="text-2xl font-black text-primary-700 dark:text-primary-400">{Math.round((day.completed / day.tasks) * 100)}%</p>
                    <p class="text-xs font-semibold text-primary-600 dark:text-primary-500">Rate</p>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full" style="width: {(day.completed / day.tasks) * 100}%"></div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<!-- Export Modal -->
{#if showExportModal}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade>
    <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-full" in:scale={{ duration: 300 }}>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
          <span class="text-3xl">📥</span>
          Export Report
        </h3>
        <button
          on:click={closeExportModal}
          class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
        >
          <svg class="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-3">Select Format</label>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-primary-500 transition-all">
              <input
                type="radio"
                bind:group={selectedExportFormat}
                value="pdf"
                class="w-5 h-5 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <div class="flex-1">
                <p class="font-bold text-neutral-900 dark:text-white">PDF Document</p>
                <p class="text-xs text-neutral-600 dark:text-neutral-400">Best for printing and sharing</p>
              </div>
              <span class="text-2xl">📄</span>
            </label>

            <label class="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-primary-500 transition-all">
              <input
                type="radio"
                bind:group={selectedExportFormat}
                value="excel"
                class="w-5 h-5 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <div class="flex-1">
                <p class="font-bold text-neutral-900 dark:text-white">Excel Spreadsheet</p>
                <p class="text-xs text-neutral-600 dark:text-neutral-400">For data analysis</p>
              </div>
              <span class="text-2xl">📊</span>
            </label>

            <label class="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-primary-500 transition-all">
              <input
                type="radio"
                bind:group={selectedExportFormat}
                value="csv"
                class="w-5 h-5 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <div class="flex-1">
                <p class="font-bold text-neutral-900 dark:text-white">CSV File</p>
                <p class="text-xs text-neutral-600 dark:text-neutral-400">Raw data format</p>
              </div>
              <span class="text-2xl">📋</span>
            </label>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            on:click={closeExportModal}
            class="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
          >
            Cancel
          </button>
          <button
            on:click={exportReport}
            class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Success Toast -->
{#if showSuccessMessage}
  <div class="fixed top-4 right-4 z-50" transition:fly={{ y: -20, duration: 300 }}>
    <div class="bg-success-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="font-bold">{successMessage}</span>
    </div>
  </div>
{/if}
