<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  
  let tasks = [];
  let filteredTasks = [];
  let loading = true;
  let searchQuery = '';
  let selectedFilter = 'all';
  let selectedPriority = 'all';
  let selectedSort = 'recent';
  let viewMode = 'kanban'; // 'kanban', 'list', 'calendar'
  let showFilterPanel = false;
  let draggedTask = null;
  
  // Kanban columns
  let columns = [
    { id: 'pending', label: 'To Do', color: 'error', icon: '📋', tasks: [] },
    { id: 'in-progress', label: 'In Progress', color: 'info', icon: '⚡', tasks: [] },
    { id: 'review', label: 'Review', color: 'warning', icon: '👁️', tasks: [] },
    { id: 'completed', label: 'Completed', color: 'success', icon: '✅', tasks: [] }
  ];
  
  let statusFilters = [
    { id: 'all', label: 'All Tasks', count: 0 },
    { id: 'pending', label: 'To Do', count: 0 },
    { id: 'in-progress', label: 'In Progress', count: 0 },
    { id: 'review', label: 'Review', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 }
  ];
  
  let priorityFilters = [
    { id: 'all', label: 'All Priority' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' }
  ];
  
  let stats = {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    overdueCount: 0
  };

  onMount(async () => {
    await loadTasks();
  });

  async function loadTasks() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      tasks = [
        {
          id: 1,
          title: 'Design Homepage UI',
          description: 'Create modern and responsive homepage design with hero section, features, and testimonials',
          status: 'in-progress',
          priority: 'urgent',
          project: 'E-commerce Platform',
          projectIcon: '🛒',
          assignee: { name: 'Sarah Smith', avatar: 'SS' },
          dueDate: '2026-01-12',
          createdDate: '2026-01-08',
          tags: ['Design', 'UI/UX', 'Frontend'],
          progress: 65,
          subtasks: { total: 5, completed: 3 },
          comments: 8,
          attachments: 3
        },
        {
          id: 2,
          title: 'Payment Gateway Integration',
          description: 'Integrate Stripe payment gateway with order processing and invoice generation',
          status: 'pending',
          priority: 'urgent',
          project: 'E-commerce Platform',
          projectIcon: '🛒',
          assignee: { name: 'John Doe', avatar: 'JD' },
          dueDate: '2026-01-11',
          createdDate: '2026-01-07',
          tags: ['Backend', 'Payment', 'API'],
          progress: 0,
          subtasks: { total: 8, completed: 0 },
          comments: 12,
          attachments: 2
        },
        {
          id: 3,
          title: 'Security Audit',
          description: 'Perform comprehensive security testing including penetration testing and vulnerability assessment',
          status: 'review',
          priority: 'high',
          project: 'Mobile Banking App',
          projectIcon: '📱',
          assignee: { name: 'Mike Johnson', avatar: 'MJ' },
          dueDate: '2026-01-15',
          createdDate: '2026-01-05',
          tags: ['Security', 'Testing', 'QA'],
          progress: 90,
          subtasks: { total: 12, completed: 11 },
          comments: 15,
          attachments: 7
        },
        {
          id: 4,
          title: 'Database Optimization',
          description: 'Optimize database queries, add indexes, and improve overall performance',
          status: 'in-progress',
          priority: 'high',
          project: 'CRM Dashboard',
          projectIcon: '📊',
          assignee: { name: 'Alex Brown', avatar: 'AB' },
          dueDate: '2026-01-18',
          createdDate: '2026-01-09',
          tags: ['Database', 'Performance', 'Backend'],
          progress: 45,
          subtasks: { total: 6, completed: 2 },
          comments: 5,
          attachments: 1
        },
        {
          id: 5,
          title: 'User Authentication Module',
          description: 'Implement JWT-based authentication with email verification and password reset',
          status: 'completed',
          priority: 'high',
          project: 'Healthcare Portal',
          projectIcon: '🏥',
          assignee: { name: 'Emma Wilson', avatar: 'EW' },
          dueDate: '2026-01-10',
          createdDate: '2026-01-03',
          tags: ['Auth', 'Backend', 'Security'],
          progress: 100,
          subtasks: { total: 10, completed: 10 },
          comments: 20,
          attachments: 5
        },
        {
          id: 6,
          title: 'API Documentation',
          description: 'Create comprehensive API documentation using Swagger/OpenAPI specifications',
          status: 'pending',
          priority: 'medium',
          project: 'CRM Dashboard',
          projectIcon: '📊',
          assignee: { name: 'Tom Harris', avatar: 'TH' },
          dueDate: '2026-01-20',
          createdDate: '2026-01-08',
          tags: ['Documentation', 'API'],
          progress: 0,
          subtasks: { total: 15, completed: 0 },
          comments: 3,
          attachments: 0
        },
        {
          id: 7,
          title: 'Mobile App Testing',
          description: 'Test mobile app on various devices and OS versions, report bugs',
          status: 'in-progress',
          priority: 'medium',
          project: 'Mobile Banking App',
          projectIcon: '📱',
          assignee: { name: 'Lisa Chen', avatar: 'LC' },
          dueDate: '2026-01-22',
          createdDate: '2026-01-10',
          tags: ['Testing', 'Mobile', 'QA'],
          progress: 30,
          subtasks: { total: 20, completed: 6 },
          comments: 9,
          attachments: 12
        },
        {
          id: 8,
          title: 'Email Templates Design',
          description: 'Design responsive email templates for notifications, invoices, and marketing',
          status: 'review',
          priority: 'low',
          project: 'E-commerce Platform',
          projectIcon: '🛒',
          assignee: { name: 'Sarah Smith', avatar: 'SS' },
          dueDate: '2026-01-25',
          createdDate: '2026-01-06',
          tags: ['Design', 'Email', 'Frontend'],
          progress: 85,
          subtasks: { total: 8, completed: 7 },
          comments: 6,
          attachments: 4
        },
        {
          id: 9,
          title: 'Property Listing Module',
          description: 'Develop property listing page with filters, sorting, and map integration',
          status: 'in-progress',
          priority: 'high',
          project: 'Real Estate Marketplace',
          projectIcon: '🏠',
          assignee: { name: 'Mike Johnson', avatar: 'MJ' },
          dueDate: '2026-01-16',
          createdDate: '2026-01-07',
          tags: ['Frontend', 'Maps', 'UI'],
          progress: 55,
          subtasks: { total: 12, completed: 7 },
          comments: 11,
          attachments: 6
        },
        {
          id: 10,
          title: 'Course Video Upload',
          description: 'Implement video upload feature with compression and CDN integration',
          status: 'pending',
          priority: 'medium',
          project: 'Learning Management System',
          projectIcon: '📚',
          assignee: { name: 'John Doe', avatar: 'JD' },
          dueDate: '2026-01-28',
          createdDate: '2026-01-09',
          tags: ['Video', 'Backend', 'CDN'],
          progress: 0,
          subtasks: { total: 9, completed: 0 },
          comments: 4,
          attachments: 1
        },
        {
          id: 11,
          title: 'Dashboard Analytics Widget',
          description: 'Create interactive analytics widget with charts and data visualization',
          status: 'completed',
          priority: 'medium',
          project: 'CRM Dashboard',
          projectIcon: '📊',
          assignee: { name: 'Alex Brown', avatar: 'AB' },
          dueDate: '2026-01-09',
          createdDate: '2026-01-02',
          tags: ['Frontend', 'Charts', 'Analytics'],
          progress: 100,
          subtasks: { total: 7, completed: 7 },
          comments: 14,
          attachments: 3
        },
        {
          id: 12,
          title: 'Push Notifications',
          description: 'Implement push notification system for mobile and web platforms',
          status: 'review',
          priority: 'high',
          project: 'Mobile Banking App',
          projectIcon: '📱',
          assignee: { name: 'Emma Wilson', avatar: 'EW' },
          dueDate: '2026-01-14',
          createdDate: '2026-01-04',
          tags: ['Notifications', 'Mobile', 'Backend'],
          progress: 95,
          subtasks: { total: 8, completed: 8 },
          comments: 10,
          attachments: 2
        },
        {
          id: 13,
          title: 'SEO Optimization',
          description: 'Optimize website for search engines with meta tags, sitemap, and schema markup',
          status: 'pending',
          priority: 'low',
          project: 'E-commerce Platform',
          projectIcon: '🛒',
          assignee: { name: 'Tom Harris', avatar: 'TH' },
          dueDate: '2026-02-01',
          createdDate: '2026-01-10',
          tags: ['SEO', 'Frontend', 'Marketing'],
          progress: 0,
          subtasks: { total: 10, completed: 0 },
          comments: 2,
          attachments: 0
        },
        {
          id: 14,
          title: 'Chat System Integration',
          description: 'Integrate real-time chat system for customer support using WebSocket',
          status: 'in-progress',
          priority: 'urgent',
          project: 'Healthcare Portal',
          projectIcon: '🏥',
          assignee: { name: 'Lisa Chen', avatar: 'LC' },
          dueDate: '2026-01-13',
          createdDate: '2026-01-06',
          tags: ['Chat', 'WebSocket', 'Real-time'],
          progress: 70,
          subtasks: { total: 11, completed: 8 },
          comments: 18,
          attachments: 5
        },
        {
          id: 15,
          title: 'Inventory Tracking System',
          description: 'Build inventory tracking with barcode scanning and stock alerts',
          status: 'pending',
          priority: 'high',
          project: 'Real Estate Marketplace',
          projectIcon: '🏠',
          assignee: { name: 'John Doe', avatar: 'JD' },
          dueDate: '2026-01-24',
          createdDate: '2026-01-09',
          tags: ['Inventory', 'Backend', 'Tracking'],
          progress: 0,
          subtasks: { total: 14, completed: 0 },
          comments: 7,
          attachments: 3
        }
      ];
      
      calculateStats();
      updateFilterCounts();
      filteredTasks = [...tasks];
      updateKanbanColumns();
      loading = false;
    } catch (error) {
      console.error('Error loading tasks:', error);
      loading = false;
    }
  }

  function calculateStats() {
    stats.totalTasks = tasks.length;
    stats.completedTasks = tasks.filter(t => t.status === 'completed').length;
    stats.inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    stats.pendingTasks = tasks.filter(t => t.status === 'pending').length;
    stats.completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100);
    stats.overdueCount = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate < today && t.status !== 'completed';
    }).length;
  }

  function updateFilterCounts() {
    statusFilters[0].count = tasks.length;
    statusFilters[1].count = tasks.filter(t => t.status === 'pending').length;
    statusFilters[2].count = tasks.filter(t => t.status === 'in-progress').length;
    statusFilters[3].count = tasks.filter(t => t.status === 'review').length;
    statusFilters[4].count = tasks.filter(t => t.status === 'completed').length;
  }

  function updateKanbanColumns() {
    columns.forEach(col => {
      col.tasks = filteredTasks.filter(task => task.status === col.id);
    });
    columns = [...columns];
  }

  function filterTasks() {
    let result = [...tasks];
    
    if (selectedFilter !== 'all') {
      result = result.filter(t => t.status === selectedFilter);
    }
    
    if (selectedPriority !== 'all') {
      result = result.filter(t => t.priority === selectedPriority);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.project.toLowerCase().includes(query) ||
        t.assignee.name.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    switch (selectedSort) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        break;
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'deadline':
        result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'progress':
        result.sort((a, b) => b.progress - a.progress);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    filteredTasks = result;
    updateKanbanColumns();
  }

  $: searchQuery, selectedFilter, selectedPriority, selectedSort, filterTasks();

  function getStatusColor(status) {
    const colors = {
      pending: 'bg-error-100 text-error-700 border-error-300 dark:bg-error-900/30 dark:text-error-400',
      'in-progress': 'bg-info-100 text-info-700 border-info-300 dark:bg-info-900/30 dark:text-info-400',
      review: 'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400',
      completed: 'bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400'
    };
    return colors[status] || colors.pending;
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

  function getDaysRemaining(dueDate) {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function isOverdue(dueDate, status) {
    if (status === 'completed') return false;
    const today = new Date();
    const deadline = new Date(dueDate);
    return deadline < today;
  }

  function viewTask(id) {
    goto(`/admin/tasks/${id}`);
  }

  function createNewTask() {
    goto('/admin/tasks/new');
  }

  // Drag and Drop for Kanban
  function handleDragStart(event, task) {
    draggedTask = task;
    event.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(event, columnId) {
    event.preventDefault();
    if (draggedTask && draggedTask.status !== columnId) {
      // Update task status
      const taskIndex = tasks.findIndex(t => t.id === draggedTask.id);
      if (taskIndex !== -1) {
        tasks[taskIndex].status = columnId;
        tasks = [...tasks];
        filterTasks();
      }
    }
    draggedTask = null;
  }
</script>

<svelte:head>
  <title>Tasks - Task Manager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
    
    <!-- Page Header -->
    <div class="relative rounded-3xl shadow-2xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div class="relative p-6 lg:p-10 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl">
                <span class="text-3xl lg:text-4xl">✅</span>
              </div>
              <div>
                <h1 class="text-3xl lg:text-4xl font-black tracking-tight">Tasks</h1>
                <p class="text-primary-100 text-sm lg:text-base font-medium mt-1">
                  Track and manage your tasks efficiently
                </p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                <span class="text-xl font-black">{stats.totalTasks}</span>
                <span class="text-xs font-semibold">Total</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                <div class="w-2 h-2 bg-info-400 rounded-full animate-pulse"></div>
                <span class="text-xs font-semibold">{stats.inProgressTasks} Active</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                <span class="text-xs font-semibold">{stats.completionRate}% Done</span>
              </div>
              {#if stats.overdueCount > 0}
                <div class="flex items-center gap-2 bg-error-500/20 backdrop-blur-md px-3 py-2 rounded-xl border border-error-400/30">
                  <span class="text-xs font-bold text-error-100">{stats.overdueCount} Overdue</span>
                </div>
              {/if}
            </div>
          </div>
          
          <button
            on:click={createNewTask}
            class="px-6 lg:px-8 py-3 lg:py-4 bg-white hover:bg-neutral-50 text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group transform hover:scale-105"
          >
            <svg class="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-20 h-20">
            <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400 font-bold text-lg">Loading tasks...</p>
        </div>
      </div>
    {:else}
      
      <!-- Filters and Search Bar -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 lg:p-6">
        <button
          on:click={() => showFilterPanel = !showFilterPanel}
          class="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-4 font-bold text-primary-700 dark:text-primary-400"
        >
          <span>Filters & Search</span>
          <svg class="w-5 h-5 transition-transform {showFilterPanel ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <div class="space-y-4 {showFilterPanel ? 'block' : 'hidden lg:block'}">
          <!-- Search Bar -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search tasks by title, project, assignee, tags..."
              class="w-full pl-12 pr-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
            />
            {#if searchQuery}
              <button
                on:click={() => searchQuery = ''}
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            {/if}
          </div>

          <!-- Filter Tabs -->
          <div class="flex flex-wrap gap-2">
            {#each statusFilters as filter}
              <button
                on:click={() => selectedFilter = filter.id}
                class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
                  selectedFilter === filter.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500 scale-105 shadow-lg'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
              >
                {filter.label}
                <span class="ml-2 px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 text-xs font-black">
                  {filter.count}
                </span>
              </button>
            {/each}
          </div>

          <!-- Priority and View Options -->
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div class="flex flex-wrap items-center gap-3">
              <label class="text-sm font-bold text-neutral-700 dark:text-neutral-300">Priority:</label>
              <select
                bind:value={selectedPriority}
                class="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              >
                {#each priorityFilters as filter}
                  <option value={filter.id}>{filter.label}</option>
                {/each}
              </select>

              <label class="text-sm font-bold text-neutral-700 dark:text-neutral-300">Sort:</label>
              <select
                bind:value={selectedSort}
                class="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="priority">Priority</option>
                <option value="deadline">Deadline</option>
                <option value="progress">Progress</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <button
                on:click={() => viewMode = 'kanban'}
                class="p-2.5 rounded-xl transition-all {
                  viewMode === 'kanban'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
                aria-label="Kanban view"
                title="Kanban Board"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                </svg>
              </button>
              <button
                on:click={() => viewMode = 'list'}
                class="p-2.5 rounded-xl transition-all {
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
                aria-label="List view"
                title="List View"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Count -->
      {#if searchQuery || selectedFilter !== 'all' || selectedPriority !== 'all'}
        <div class="flex items-center justify-between px-2">
          <p class="text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Found {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </p>
          {#if searchQuery || selectedFilter !== 'all' || selectedPriority !== 'all'}
            <button
              on:click={() => { searchQuery = ''; selectedFilter = 'all'; selectedPriority = 'all'; }}
              class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filters
            </button>
          {/if}
        </div>
      {/if}

      <!-- Tasks View -->
      {#if filteredTasks.length === 0}
        <div class="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-800 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <div class="w-24 h-24 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-2">No tasks found</h3>
          <p class="text-neutral-600 dark:text-neutral-400 mb-6">Try adjusting your filters or create a new task</p>
          <button
            on:click={createNewTask}
            class="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
          >
            Create New Task
          </button>
        </div>
      {:else if viewMode === 'kanban'}
        <!-- Kanban Board View -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {#each columns as column (column.id)}
            <div class="flex flex-col gap-3">
              <!-- Column Header -->
              <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border-2 border-neutral-200 dark:border-neutral-700 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{column.icon}</span>
                    <h3 class="text-base font-black text-neutral-900 dark:text-white">{column.label}</h3>
                  </div>
                  <span class="px-3 py-1 bg-{column.color}-100 dark:bg-{column.color}-900/30 text-{column.color}-700 dark:text-{column.color}-400 rounded-full text-sm font-black">
                    {column.tasks.length}
                  </span>
                </div>
              </div>

              <!-- Drop Zone -->
              <div
                on:dragover={handleDragOver}
                on:drop={(e) => handleDrop(e, column.id)}
                class="flex-1 space-y-3 min-h-[200px] p-2 rounded-2xl border-2 border-dashed border-transparent {draggedTask && draggedTask.status !== column.id ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' : ''}"
              >
                {#each column.tasks as task (task.id)}
                  <div
                    draggable="true"
                    on:dragstart={(e) => handleDragStart(e, task)}
                    in:fly={{ y: 20, duration: 300 }}
                    animate:flip={{ duration: 300 }}
                    class="group bg-white dark:bg-neutral-800 rounded-2xl shadow-md hover:shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 cursor-move transition-all hover:-translate-y-1"
                    on:click={() => viewTask(task.id)}
                    on:keydown={(e) => e.key === 'Enter' && viewTask(task.id)}
                    role="button"
                    tabindex="0"
                  >
                    <!-- Task Header -->
                    <div class="flex items-start justify-between gap-2 mb-3">
                      <div class="flex items-center gap-2 flex-1 min-w-0">
                        <span class="text-xl flex-shrink-0">{task.projectIcon}</span>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-sm font-black text-neutral-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {task.title}
                          </h4>
                          <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold truncate">
                            {task.project}
                          </p>
                        </div>
                      </div>
                      <span class="px-2 py-1 rounded-lg text-xs font-bold {getPriorityColor(task.priority)} flex-shrink-0">
                        {task.priority.toUpperCase()}
                      </span>
                    </div>

                    <!-- Progress Bar -->
                    {#if task.progress > 0}
                      <div class="mb-3">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Progress</span>
                          <span class="text-xs font-black text-neutral-900 dark:text-white">{task.progress}%</span>
                        </div>
                        <div class="relative w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                          <div
                            class="absolute inset-y-0 left-0 bg-gradient-to-r {getProgressColor(task.progress)} rounded-full transition-all duration-500"
                            style="width: {task.progress}%"
                          ></div>
                        </div>
                      </div>
                    {/if}

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-1 mb-3">
                      {#each task.tags.slice(0, 2) as tag}
                        <span class="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs font-semibold">
                          {tag}
                        </span>
                      {/each}
                      {#if task.tags.length > 2}
                        <span class="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs font-bold">
                          +{task.tags.length - 2}
                        </span>
                      {/if}
                    </div>

                    <!-- Task Footer -->
                    <div class="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-7 h-7 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-white text-xs font-bold shadow-md"
                          title={task.assignee.name}
                        >
                          {task.assignee.avatar}
                        </div>
                        <div class="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                          </svg>
                          <span class="font-semibold">{task.comments}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-1 text-xs {isOverdue(task.dueDate, task.status) ? 'text-error-700 dark:text-error-400 font-bold' : 'text-neutral-600 dark:text-neutral-400 font-semibold'}">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                {/each}

                {#if column.tasks.length === 0}
                  <div class="flex flex-col items-center justify-center py-12 text-neutral-400">
                    <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p class="text-sm font-semibold">No tasks</p>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- List View -->
        <div class="space-y-4">
          {#each filteredTasks as task (task.id)}
            <div
              in:fly={{ y: 20, duration: 400, delay: 50 }}
              class="group bg-white dark:bg-neutral-800 rounded-3xl shadow-xl hover:shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              on:click={() => viewTask(task.id)}
              on:keydown={(e) => e.key === 'Enter' && viewTask(task.id)}
              role="button"
              tabindex="0"
            >
              <div class="p-6">
                <div class="flex flex-col lg:flex-row lg:items-center gap-4">
                  <!-- Left: Task Info -->
                  <div class="flex items-start gap-4 flex-1 min-w-0">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                      {task.projectIcon}
                    </div>
                    <div class="flex-1 min-w-0 space-y-2">
                      <div class="flex items-start gap-3 flex-wrap">
                        <h3 class="text-lg font-black text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {task.title}
                        </h3>
                        <span class="px-3 py-1 rounded-full text-xs font-bold {getPriorityColor(task.priority)}">
                          {task.priority.toUpperCase()}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-bold border-2 {getStatusColor(task.status)}">
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {task.description}
                      </p>
                      <div class="flex flex-wrap items-center gap-4 text-xs">
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          <span class="font-semibold text-neutral-600 dark:text-neutral-400">{task.project}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <div
                            class="w-6 h-6 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-white text-xs font-bold"
                            title={task.assignee.name}
                          >
                            {task.assignee.avatar}
                          </div>
                          <span class="font-semibold text-neutral-600 dark:text-neutral-400">{task.assignee.name}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span class="font-semibold {isOverdue(task.dueDate, task.status) ? 'text-error-700 dark:text-error-400' : 'text-neutral-600 dark:text-neutral-400'}">
                            {formatDate(task.dueDate)}
                            {#if isOverdue(task.dueDate, task.status)}
                              <span class="font-bold">(Overdue)</span>
                            {:else if getDaysRemaining(task.dueDate) > 0}
                              <span class="text-neutral-500">({getDaysRemaining(task.dueDate)} days)</span>
                            {/if}
                          </span>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        {#each task.tags as tag}
                          <span class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold">
                            {tag}
                          </span>
                        {/each}
                      </div>
                    </div>
                  </div>

                  <!-- Right: Stats and Progress -->
                  <div class="flex flex-col items-end gap-4">
                    <div class="text-right">
                      <p class="text-3xl font-black text-neutral-900 dark:text-white mb-1">{task.progress}%</p>
                      <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Completion</p>
                    </div>

                    <div class="flex items-center gap-4 text-sm">
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                        </svg>
                        <span class="font-bold text-neutral-700 dark:text-neutral-300">{task.subtasks.completed}/{task.subtasks.total}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                        </svg>
                        <span class="font-bold text-neutral-700 dark:text-neutral-300">{task.comments}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                        </svg>
                        <span class="font-bold text-neutral-700 dark:text-neutral-300">{task.attachments}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar (List View) -->
                <div class="mt-4">
                  <div class="relative w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                    <div
                      class="absolute inset-y-0 left-0 bg-gradient-to-r {getProgressColor(task.progress)} rounded-full transition-all duration-500"
                      style="width: {task.progress}%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
