<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade, scale } from 'svelte/transition';
  
  let loading = true;
  let searchQuery = '';
  let selectedFilter = 'all';
  let selectedPriority = 'all';
  let selectedSort = 'dueDate';
  let showFilterMenu = false;

  // Task statistics
  let taskStats = {
    total: 15,
    active: 5,
    pending: 3,
    completed: 7,
    overdue: 0
  };

  // All tasks
  let allTasks = [
    // New Requests
    { 
      id: 1, 
      title: 'Implement OAuth 2.0 Authentication', 
      project: 'E-commerce Platform',
      projectColor: 'from-blue-500 to-blue-600',
      priority: 'urgent', 
      status: 'request',
      description: 'Integrate OAuth 2.0 authentication with Google and Facebook providers.',
      requestedBy: 'Sarah Johnson',
      requestedByRole: 'Project Manager',
      requestedDate: '2026-01-10',
      deadline: '2026-01-18',
      daysLeft: 8
    },
    { 
      id: 2, 
      title: 'Design User Dashboard Mockups', 
      project: 'CRM Dashboard',
      projectColor: 'from-purple-500 to-purple-600',
      priority: 'high', 
      status: 'request',
      description: 'Create high-fidelity mockups for the user dashboard.',
      requestedBy: 'Mike Brown',
      requestedByRole: 'Lead Designer',
      requestedDate: '2026-01-09',
      deadline: '2026-01-20',
      daysLeft: 10
    },
    { 
      id: 3, 
      title: 'API Performance Optimization', 
      project: 'Healthcare Portal',
      projectColor: 'from-green-500 to-green-600',
      priority: 'medium', 
      status: 'request',
      description: 'Optimize database queries and implement caching.',
      requestedBy: 'David Wilson',
      requestedByRole: 'Tech Lead',
      requestedDate: '2026-01-08',
      deadline: '2026-01-22',
      daysLeft: 12
    },

    // Pending Admin Approval
    { 
      id: 4, 
      title: 'Payment Gateway Integration', 
      project: 'E-commerce Platform',
      projectColor: 'from-blue-500 to-blue-600',
      priority: 'urgent',
      status: 'pending_approval',
      estimatedTime: '16 hours',
      submittedDate: '2026-01-09',
      deadline: '2026-01-15',
      daysLeft: 5
    },
    { 
      id: 5, 
      title: 'Database Migration Script', 
      project: 'CRM Dashboard',
      projectColor: 'from-purple-500 to-purple-600',
      priority: 'high',
      status: 'pending_approval',
      estimatedTime: '12 hours',
      submittedDate: '2026-01-08',
      deadline: '2026-01-17',
      daysLeft: 7
    },

    // Active Tasks
    { 
      id: 6, 
      title: 'User Authentication Module', 
      project: 'Healthcare Portal',
      projectColor: 'from-green-500 to-green-600',
      priority: 'high', 
      status: 'in-progress', 
      progress: 75,
      approvedTime: '20 hours',
      timeSpent: '15 hours',
      timeRemaining: '5 hours',
      dueDate: '2026-01-18',
      startDate: '2026-01-05',
      daysLeft: 8
    },
    { 
      id: 7, 
      title: 'API Documentation', 
      project: 'CRM Dashboard',
      projectColor: 'from-purple-500 to-purple-600',
      priority: 'medium', 
      status: 'in-progress', 
      progress: 45,
      approvedTime: '10 hours',
      timeSpent: '4.5 hours',
      timeRemaining: '5.5 hours',
      dueDate: '2026-01-20',
      startDate: '2026-01-07',
      daysLeft: 10
    },
    { 
      id: 8, 
      title: 'Mobile App UI Components', 
      project: 'Mobile Banking App',
      projectColor: 'from-orange-500 to-orange-600',
      priority: 'high', 
      status: 'in-progress', 
      progress: 60,
      approvedTime: '18 hours',
      timeSpent: '10.8 hours',
      timeRemaining: '7.2 hours',
      dueDate: '2026-01-16',
      startDate: '2026-01-06',
      daysLeft: 6
    },
    { 
      id: 9, 
      title: 'Email Notification System', 
      project: 'E-commerce Platform',
      projectColor: 'from-blue-500 to-blue-600',
      priority: 'medium', 
      status: 'in-progress', 
      progress: 30,
      approvedTime: '14 hours',
      timeSpent: '4.2 hours',
      timeRemaining: '9.8 hours',
      dueDate: '2026-01-25',
      startDate: '2026-01-08',
      daysLeft: 15
    },
    { 
      id: 10, 
      title: 'Search Functionality', 
      project: 'Healthcare Portal',
      projectColor: 'from-green-500 to-green-600',
      priority: 'low', 
      status: 'in-progress', 
      progress: 20,
      approvedTime: '8 hours',
      timeSpent: '1.6 hours',
      timeRemaining: '6.4 hours',
      dueDate: '2026-01-28',
      startDate: '2026-01-09',
      daysLeft: 18
    },

    // Completed Tasks
    { 
      id: 11, 
      title: 'Homepage UI Design', 
      project: 'E-commerce Platform',
      projectColor: 'from-blue-500 to-blue-600',
      priority: 'high',
      status: 'completed',
      completedDate: '2026-01-09',
      timeSpent: '14 hours',
      approvedTime: '16 hours',
      dueDate: '2026-01-09'
    },
    { 
      id: 12, 
      title: 'User Profile Page', 
      project: 'CRM Dashboard',
      projectColor: 'from-purple-500 to-purple-600',
      priority: 'medium',
      status: 'completed',
      completedDate: '2026-01-08',
      timeSpent: '8 hours',
      approvedTime: '10 hours',
      dueDate: '2026-01-08'
    },
    { 
      id: 13, 
      title: 'Login Flow Optimization', 
      project: 'Healthcare Portal',
      projectColor: 'from-green-500 to-green-600',
      priority: 'high',
      status: 'completed',
      completedDate: '2026-01-07',
      timeSpent: '12 hours',
      approvedTime: '12 hours',
      dueDate: '2026-01-07'
    },
    { 
      id: 14, 
      title: 'Dashboard Charts Integration', 
      project: 'CRM Dashboard',
      projectColor: 'from-purple-500 to-purple-600',
      priority: 'medium',
      status: 'completed',
      completedDate: '2026-01-06',
      timeSpent: '10 hours',
      approvedTime: '11 hours',
      dueDate: '2026-01-06'
    },
    { 
      id: 15, 
      title: 'Form Validation System', 
      project: 'E-commerce Platform',
      projectColor: 'from-blue-500 to-blue-600',
      priority: 'low',
      status: 'completed',
      completedDate: '2026-01-05',
      timeSpent: '6 hours',
      approvedTime: '8 hours',
      dueDate: '2026-01-05'
    }
  ];

  let filteredTasks = [];

  const filterOptions = [
    { id: 'all', label: 'All Tasks', count: 0 },
    { id: 'request', label: 'New Requests', count: 0 },
    { id: 'pending_approval', label: 'Pending Approval', count: 0 },
    { id: 'in-progress', label: 'Active', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 }
  ];

  const priorityOptions = [
    { id: 'all', label: 'All Priorities' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' }
  ];

  const sortOptions = [
    { id: 'dueDate', label: 'Due Date' },
    { id: 'priority', label: 'Priority' },
    { id: 'progress', label: 'Progress' },
    { id: 'recent', label: 'Recently Added' }
  ];

  onMount(async () => {
    await loadTasks();
    updateFilterCounts();
    applyFilters();
  });

  async function loadTasks() {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      loading = false;
    } catch (error) {
      console.error('Error loading tasks:', error);
      loading = false;
    }
  }

  function updateFilterCounts() {
    filterOptions[0].count = allTasks.length;
    filterOptions[1].count = allTasks.filter(t => t.status === 'request').length;
    filterOptions[2].count = allTasks.filter(t => t.status === 'pending_approval').length;
    filterOptions[3].count = allTasks.filter(t => t.status === 'in-progress').length;
    filterOptions[4].count = allTasks.filter(t => t.status === 'completed').length;
  }

  function applyFilters() {
    let tasks = [...allTasks];

    // Filter by status
    if (selectedFilter !== 'all') {
      tasks = tasks.filter(task => task.status === selectedFilter);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      tasks = tasks.filter(task => task.priority === selectedPriority);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query)
      );
    }

    // Sort tasks
    tasks = sortTasks(tasks);

    filteredTasks = tasks;
  }

  function sortTasks(tasks) {
    switch(selectedSort) {
      case 'dueDate':
        return tasks.sort((a, b) => {
          const dateA = a.dueDate || a.deadline || '9999-12-31';
          const dateB = b.dueDate || b.deadline || '9999-12-31';
          return new Date(dateA) - new Date(dateB);
        });
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'progress':
        return tasks.sort((a, b) => (b.progress || 0) - (a.progress || 0));
      case 'recent':
        return tasks.sort((a, b) => b.id - a.id);
      default:
        return tasks;
    }
  }

  $: {
    searchQuery;
    selectedFilter;
    selectedPriority;
    selectedSort;
    applyFilters();
  }

  function getPriorityColor(priority) {
    const colors = {
      urgent: 'text-error-700 bg-error-100 dark:bg-error-900/30 dark:text-error-400 border-error-200 dark:border-error-800',
      high: 'text-warning-700 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400 border-warning-200 dark:border-warning-800',
      medium: 'text-info-700 bg-info-100 dark:bg-info-900/30 dark:text-info-400 border-info-200 dark:border-info-800',
      low: 'text-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
    };
    return colors[priority] || colors.medium;
  }

  function getStatusBadge(status) {
    const badges = {
      request: { label: 'New Request', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800' },
      pending_approval: { label: 'Pending Approval', color: 'bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400 border-info-200 dark:border-info-800' },
      'in-progress': { label: 'In Progress', color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800' },
      completed: { label: 'Completed', color: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800' }
    };
    return badges[status] || badges['in-progress'];
  }

  function getProgressColor(progress) {
    if (progress >= 80) return 'from-success-500 to-success-600';
    if (progress >= 50) return 'from-info-500 to-info-600';
    if (progress >= 25) return 'from-warning-500 to-warning-600';
    return 'from-error-500 to-error-600';
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function viewTask(id) {
    goto(`/employee/tasks/${id}`);
  }

  function clearFilters() {
    searchQuery = '';
    selectedFilter = 'all';
    selectedPriority = 'all';
    selectedSort = 'dueDate';
  }
</script>

<svelte:head>
  <title>My Tasks - Employee Portal</title>
</svelte:head>

<div class="min-h-screen">
  {#if loading}
    <div class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-16 sm:w-20 h-16 sm:h-20">
          <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 font-bold text-sm sm:text-lg">Loading tasks...</p>
      </div>
    </div>
  {:else}
    <div class="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 lg:space-y-8">
      
      <!-- Page Header -->
      <div class="relative rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div class="relative p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 text-white">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2">My Tasks</h1>
              <p class="text-sm sm:text-base lg:text-lg text-primary-100 font-semibold">Manage and track all your assigned tasks</p>
            </div>
            <button
              on:click={() => goto('/employee/tasks/new')}
              class="px-4 lg:px-6 py-2.5 lg:py-3 bg-white hover:bg-neutral-50 text-primary-700 rounded-xl lg:rounded-2xl shadow-xl text-sm lg:text-base font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Task Request
            </button>
          </div>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{taskStats.total}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Total Tasks</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{taskStats.active}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Active</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{taskStats.pending}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Pending</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{taskStats.completed}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Completed</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{taskStats.overdue}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-3 sm:p-4 lg:p-6">
        <div class="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search tasks by title or project..."
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-3.5 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl lg:rounded-2xl text-sm lg:text-base text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- Filter Buttons -->
          <div class="flex flex-wrap gap-2 lg:gap-3">
            <!-- Status Filter -->
            <select
              bind:value={selectedFilter}
              class="px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm lg:text-base text-neutral-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {#each filterOptions as option}
                <option value={option.id}>{option.label} ({option.count})</option>
              {/each}
            </select>

            <!-- Priority Filter -->
            <select
              bind:value={selectedPriority}
              class="px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm lg:text-base text-neutral-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {#each priorityOptions as option}
                <option value={option.id}>{option.label}</option>
              {/each}
            </select>

            <!-- Sort -->
            <select
              bind:value={selectedSort}
              class="px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm lg:text-base text-neutral-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {#each sortOptions as option}
                <option value={option.id}>Sort: {option.label}</option>
              {/each}
            </select>

            <!-- Clear Filters -->
            {#if searchQuery || selectedFilter !== 'all' || selectedPriority !== 'all' || selectedSort !== 'dueDate'}
              <button
                on:click={clearFilters}
                class="px-3 sm:px-4 py-2.5 sm:py-3 bg-error-100 dark:bg-error-900/30 hover:bg-error-200 dark:hover:bg-error-900/50 text-error-700 dark:text-error-400 font-bold rounded-xl text-sm lg:text-base transition-all flex items-center gap-2"
              >
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Clear
              </button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Tasks List -->
      {#if filteredTasks.length === 0}
        <div class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-8 lg:p-16 text-center">
          <div class="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 lg:w-12 lg:h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 class="text-xl lg:text-2xl font-black text-neutral-900 dark:text-white mb-2">No tasks found</h3>
          <p class="text-sm lg:text-base text-neutral-600 dark:text-neutral-400 mb-6">Try adjusting your filters or search query</p>
          <button
            on:click={clearFilters}
            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all"
          >
            Clear All Filters
          </button>
        </div>
      {:else}
        <div class="space-y-3 lg:space-y-4">
          {#each filteredTasks as task (task.id)}
            <div
              class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all overflow-hidden"
              in:fly={{ y: 20, duration: 300 }}
            >
              <!-- Project Color Bar -->
              <div class="h-1.5 bg-gradient-to-r {task.projectColor}"></div>
              
              <div class="p-4 sm:p-5 lg:p-6 xl:p-8">
                <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  <!-- Main Content -->
                  <div class="flex-1 space-y-3 lg:space-y-4">
                    <!-- Title and Badges -->
                    <div class="flex flex-wrap items-start gap-2 lg:gap-3">
                      <h3 class="text-base sm:text-lg lg:text-xl xl:text-2xl font-black text-neutral-900 dark:text-white flex-1 min-w-0">
                        {task.title}
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-bold border-2 {getPriorityColor(task.priority)}">
                          {task.priority.toUpperCase()}
                        </span>
                        <span class="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-bold border-2 {getStatusBadge(task.status).color}">
                          {getStatusBadge(task.status).label}
                        </span>
                      </div>
                    </div>

                    <!-- Project -->
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 lg:w-5 lg:h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                      </svg>
                      <span class="text-sm lg:text-base font-bold text-primary-600 dark:text-primary-400">{task.project}</span>
                    </div>

                    <!-- Description (for requests) -->
                    {#if task.description}
                      <p class="text-sm lg:text-base text-neutral-700 dark:text-neutral-300 line-clamp-2">{task.description}</p>
                    {/if}

                    <!-- Task Details -->
                    <div class="flex flex-wrap gap-3 lg:gap-4 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                      {#if task.requestedBy}
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          <span class="font-semibold">{task.requestedBy}</span>
                        </div>
                      {/if}

                      {#if task.estimatedTime}
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span class="font-bold">Estimated: {task.estimatedTime}</span>
                        </div>
                      {/if}

                      {#if task.approvedTime}
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="font-bold">Approved: {task.approvedTime}</span>
                        </div>
                      {/if}

                      {#if task.timeSpent}
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span class="font-semibold">Spent: {task.timeSpent}</span>
                        </div>
                      {/if}

                      {#if task.daysLeft !== undefined}
                        <div class="flex items-center gap-1.5 font-bold {task.daysLeft <= 3 ? 'text-error-700 dark:text-error-400' : task.daysLeft <= 7 ? 'text-warning-700 dark:text-warning-400' : ''}">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span>{task.daysLeft} days left</span>
                        </div>
                      {/if}

                      {#if task.dueDate || task.deadline}
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span class="font-semibold">Due: {formatDate(task.dueDate || task.deadline)}</span>
                        </div>
                      {/if}
                    </div>

                    <!-- Progress Bar (for active tasks) -->
                    {#if task.status === 'in-progress' && task.progress !== undefined}
                      <div class="space-y-2">
                        <div class="flex items-center justify-between text-xs lg:text-sm">
                          <span class="font-semibold text-neutral-700 dark:text-neutral-300">Progress</span>
                          <span class="font-black text-neutral-900 dark:text-white">{task.progress}%</span>
                        </div>
                        <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 lg:h-3">
                          <div
                            class="bg-gradient-to-r {getProgressColor(task.progress)} h-2.5 lg:h-3 rounded-full transition-all duration-500"
                            style="width: {task.progress}%"
                          ></div>
                        </div>
                      </div>
                    {/if}
                  </div>

                  <!-- Action Button -->
                  <div class="flex lg:flex-col justify-end items-center gap-2 lg:gap-3 flex-shrink-0">
                    <button
                      on:click={() => viewTask(task.id)}
                      class="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 lg:py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {#if task.status === 'request'}
                        <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Accept Task
                      {:else if task.status === 'pending_approval'}
                        <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View Details
                      {:else if task.status === 'in-progress'}
                        <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Continue Work
                      {:else}
                        <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View Details
                      {/if}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
