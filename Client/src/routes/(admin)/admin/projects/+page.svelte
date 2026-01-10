<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly } from 'svelte/transition';
  
  let projects = [];
  let filteredProjects = [];
  let loading = true;
  let searchQuery = '';
  let selectedFilter = 'all';
  let selectedSort = 'recent';
  let viewMode = 'grid';
  let showFilterPanel = false;
  
  let statusFilters = [
    { id: 'all', label: 'All Projects', count: 0, color: 'primary' },
    { id: 'active', label: 'Active', count: 0, color: 'success' },
    { id: 'planning', label: 'Planning', count: 0, color: 'info' },
    { id: 'on-hold', label: 'On Hold', count: 0, color: 'warning' },
    { id: 'completed', label: 'Completed', count: 0, color: 'secondary' }
  ];
  
  let stats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBudget: 0,
    averageProgress: 0
  };

  onMount(async () => {
    await loadProjects();
  });

  async function loadProjects() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      projects = [
        {
          id: 1,
          name: 'E-commerce Platform',
          description: 'Complete online shopping solution with payment gateway integration, inventory management, and customer analytics.',
          status: 'active',
          progress: 75,
          priority: 'high',
          tech: ['SvelteKit', 'MongoDB', 'Tailwind', 'Stripe'],
          team: [
            { name: 'John Doe', avatar: 'JD', role: 'Lead Developer' },
            { name: 'Sarah Smith', avatar: 'SS', role: 'UI/UX Designer' },
            { name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer' },
            { name: 'Emma Wilson', avatar: 'EW', role: 'QA Engineer' },
            { name: 'Alex Brown', avatar: 'AB', role: 'DevOps' }
          ],
          dueDate: '2026-02-15',
          startDate: '2025-11-01',
          budget: 50000,
          spent: 37500,
          client: 'TechCorp Inc.',
          tasks: { total: 45, completed: 34, inProgress: 8, pending: 3 },
          category: 'Web Development',
          icon: '🛒'
        },
        {
          id: 2,
          name: 'Mobile Banking App',
          description: 'Secure mobile banking application with biometric authentication, real-time transactions, and investment tracking.',
          status: 'active',
          progress: 60,
          priority: 'urgent',
          tech: ['React Native', 'PostgreSQL', 'Node.js', 'AWS'],
          team: [
            { name: 'Sarah Smith', avatar: 'SS', role: 'Project Manager' },
            { name: 'Mike Johnson', avatar: 'MJ', role: 'Mobile Developer' },
            { name: 'John Doe', avatar: 'JD', role: 'Security Specialist' },
            { name: 'Lisa Chen', avatar: 'LC', role: 'Backend Developer' }
          ],
          dueDate: '2026-03-01',
          startDate: '2025-10-15',
          budget: 80000,
          spent: 48000,
          client: 'FinanceBank Ltd.',
          tasks: { total: 62, completed: 37, inProgress: 18, pending: 7 },
          category: 'Mobile Development',
          icon: '📱'
        },
        {
          id: 3,
          name: 'CRM Dashboard',
          description: 'Enterprise customer relationship management system with advanced analytics, reporting, and automation tools.',
          status: 'active',
          progress: 45,
          priority: 'medium',
          tech: ['Vue.js', 'MySQL', 'Laravel', 'Docker'],
          team: [
            { name: 'Emma Wilson', avatar: 'EW', role: 'Full Stack Developer' },
            { name: 'Alex Brown', avatar: 'AB', role: 'Database Admin' },
            { name: 'Tom Harris', avatar: 'TH', role: 'Frontend Developer' }
          ],
          dueDate: '2026-02-28',
          startDate: '2025-12-01',
          budget: 60000,
          spent: 27000,
          client: 'Enterprise Solutions',
          tasks: { total: 38, completed: 17, inProgress: 15, pending: 6 },
          category: 'Web Development',
          icon: '📊'
        },
        {
          id: 4,
          name: 'AI Chatbot Platform',
          description: 'Intelligent conversational AI platform with natural language processing and multi-language support.',
          status: 'completed',
          progress: 100,
          priority: 'high',
          tech: ['Python', 'TensorFlow', 'FastAPI', 'Redis'],
          team: [
            { name: 'John Doe', avatar: 'JD', role: 'AI Engineer' },
            { name: 'Lisa Chen', avatar: 'LC', role: 'ML Specialist' },
            { name: 'Tom Harris', avatar: 'TH', role: 'Backend Developer' }
          ],
          dueDate: '2026-01-20',
          startDate: '2025-09-01',
          budget: 35000,
          spent: 34500,
          client: 'ChatTech Systems',
          tasks: { total: 28, completed: 28, inProgress: 0, pending: 0 },
          category: 'AI/ML',
          icon: '🤖'
        },
        {
          id: 5,
          name: 'Healthcare Portal',
          description: 'Patient management system with appointment scheduling, medical records, and telemedicine capabilities.',
          status: 'planning',
          progress: 15,
          priority: 'high',
          tech: ['Next.js', 'PostgreSQL', 'GraphQL', 'WebRTC'],
          team: [
            { name: 'Sarah Smith', avatar: 'SS', role: 'Project Lead' },
            { name: 'Emma Wilson', avatar: 'EW', role: 'Developer' }
          ],
          dueDate: '2026-04-30',
          startDate: '2026-01-05',
          budget: 95000,
          spent: 14250,
          client: 'MediCare Hospital',
          tasks: { total: 52, completed: 8, inProgress: 6, pending: 38 },
          category: 'Healthcare',
          icon: '🏥'
        },
        {
          id: 6,
          name: 'Real Estate Marketplace',
          description: 'Property listing platform with virtual tours, mortgage calculators, and agent management system.',
          status: 'active',
          progress: 82,
          priority: 'medium',
          tech: ['React', 'Firebase', 'Mapbox', 'Stripe'],
          team: [
            { name: 'Mike Johnson', avatar: 'MJ', role: 'Lead Developer' },
            { name: 'Alex Brown', avatar: 'AB', role: 'Frontend Developer' },
            { name: 'Lisa Chen', avatar: 'LC', role: 'Backend Developer' },
            { name: 'Tom Harris', avatar: 'TH', role: 'DevOps' }
          ],
          dueDate: '2026-01-25',
          startDate: '2025-10-01',
          budget: 72000,
          spent: 59040,
          client: 'PropertyHub Inc.',
          tasks: { total: 41, completed: 34, inProgress: 5, pending: 2 },
          category: 'Web Development',
          icon: '🏠'
        },
        {
          id: 7,
          name: 'Learning Management System',
          description: 'Educational platform with course management, video streaming, assessments, and student analytics.',
          status: 'active',
          progress: 55,
          priority: 'medium',
          tech: ['Django', 'PostgreSQL', 'React', 'AWS S3'],
          team: [
            { name: 'Emma Wilson', avatar: 'EW', role: 'Full Stack Developer' },
            { name: 'John Doe', avatar: 'JD', role: 'Backend Developer' },
            { name: 'Sarah Smith', avatar: 'SS', role: 'UI Designer' }
          ],
          dueDate: '2026-03-15',
          startDate: '2025-11-20',
          budget: 68000,
          spent: 37400,
          client: 'EduTech Academy',
          tasks: { total: 48, completed: 26, inProgress: 14, pending: 8 },
          category: 'EdTech',
          icon: '📚'
        },
        {
          id: 8,
          name: 'IoT Dashboard',
          description: 'Real-time monitoring system for IoT devices with data visualization and automated alerts.',
          status: 'on-hold',
          progress: 30,
          priority: 'low',
          tech: ['Angular', 'InfluxDB', 'MQTT', 'Grafana'],
          team: [
            { name: 'Alex Brown', avatar: 'AB', role: 'IoT Developer' },
            { name: 'Tom Harris', avatar: 'TH', role: 'Frontend Developer' }
          ],
          dueDate: '2026-05-10',
          startDate: '2025-12-10',
          budget: 45000,
          spent: 13500,
          client: 'SmartHome Solutions',
          tasks: { total: 35, completed: 10, inProgress: 3, pending: 22 },
          category: 'IoT',
          icon: '📡'
        }
      ];
      
      calculateStats();
      updateFilterCounts();
      filteredProjects = [...projects];
      loading = false;
    } catch (error) {
      console.error('Error loading projects:', error);
      loading = false;
    }
  }

  function calculateStats() {
    stats.totalProjects = projects.length;
    stats.activeProjects = projects.filter(p => p.status === 'active').length;
    stats.completedProjects = projects.filter(p => p.status === 'completed').length;
    stats.totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    stats.averageProgress = Math.round(
      projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
    );
  }

  function updateFilterCounts() {
    statusFilters[0].count = projects.length;
    statusFilters[1].count = projects.filter(p => p.status === 'active').length;
    statusFilters[2].count = projects.filter(p => p.status === 'planning').length;
    statusFilters[3].count = projects.filter(p => p.status === 'on-hold').length;
    statusFilters[4].count = projects.filter(p => p.status === 'completed').length;
  }

  function filterProjects() {
    let result = [...projects];
    
    if (selectedFilter !== 'all') {
      result = result.filter(p => p.status === selectedFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.client.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tech.some(t => t.toLowerCase().includes(query))
      );
    }
    
    switch (selectedSort) {
      case 'recent':
        result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      case 'progress':
        result.sort((a, b) => b.progress - a.progress);
        break;
      case 'budget':
        result.sort((a, b) => b.budget - a.budget);
        break;
      case 'deadline':
        result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    filteredProjects = result;
  }

  $: searchQuery, selectedFilter, selectedSort, filterProjects();

  function getStatusColor(status) {
    const colors = {
      active: 'bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400 dark:border-success-700',
      completed: 'bg-info-100 text-info-700 border-info-300 dark:bg-info-900/30 dark:text-info-400 dark:border-info-700',
      'on-hold': 'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-700',
      planning: 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600'
    };
    return colors[status] || colors.planning;
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

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      minimumFractionDigits: 0,
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

  function getDaysRemaining(dueDate) {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function viewProject(id) {
    goto(`/admin/projects/${id}`);
  }

  function createNewProject() {
    goto('/admin/projects/new');
  }
</script>

<svelte:head>
  <title>Projects - Task Manager</title>
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
                <span class="text-3xl lg:text-4xl">📁</span>
              </div>
              <div>
                <h1 class="text-3xl lg:text-4xl font-black tracking-tight">Projects</h1>
                <p class="text-primary-100 text-sm lg:text-base font-medium mt-1">
                  Manage and track all your projects
                </p>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-3 mt-4">
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <span class="text-2xl font-black">{stats.totalProjects}</span>
                <span class="text-sm font-semibold">Total Projects</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <div class="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                <span class="text-sm font-semibold">{stats.activeProjects} Active</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <span class="text-sm font-semibold">{stats.averageProgress}% Avg Progress</span>
              </div>
            </div>
          </div>
          
          <button
            on:click={createNewProject}
            class="px-6 lg:px-8 py-3 lg:py-4 bg-white hover:bg-neutral-50 text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group transform hover:scale-105"
          >
            <svg class="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            <span>New Project</span>
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
          <p class="text-neutral-600 dark:text-neutral-400 font-bold text-lg">Loading projects...</p>
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
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search projects by name, client, technology..."
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

          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <label class="text-sm font-bold text-neutral-700 dark:text-neutral-300">Sort by:</label>
              <select
                bind:value={selectedSort}
                class="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="recent">Most Recent</option>
                <option value="progress">Progress</option>
                <option value="budget">Budget</option>
                <option value="deadline">Deadline</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <button
                on:click={() => viewMode = 'grid'}
                class="p-2.5 rounded-xl transition-all {
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
                aria-label="Grid view"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
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
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {#if searchQuery || selectedFilter !== 'all'}
        <div class="flex items-center justify-between px-2">
          <p class="text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Found {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
          {#if searchQuery || selectedFilter !== 'all'}
            <button
              on:click={() => { searchQuery = ''; selectedFilter = 'all'; }}
              class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filters
            </button>
          {/if}
        </div>
      {/if}

      {#if filteredProjects.length === 0}
        <div class="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-800 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <div class="w-24 h-24 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-2">No projects found</h3>
          <p class="text-neutral-600 dark:text-neutral-400 mb-6">Try adjusting your search or filters</p>
          <button
            on:click={createNewProject}
            class="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
          >
            Create New Project
          </button>
        </div>
      {:else}
        <div class="{viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}">
          {#each filteredProjects as project (project.id)}
            <div
              in:fly={{ y: 20, duration: 400, delay: 100 }}
              class="group bg-white dark:bg-neutral-800 rounded-3xl shadow-xl hover:shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              on:click={() => viewProject(project.id)}
              on:keydown={(e) => e.key === 'Enter' && viewProject(project.id)}
              role="button"
              tabindex="0"
            >
              <div class="p-6 space-y-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                      {project.icon}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-black text-neutral-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {project.name}
                      </h3>
                      <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold truncate">
                        {project.client}
                      </p>
                    </div>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-bold {getPriorityColor(project.priority)} flex-shrink-0">
                    {project.priority.toUpperCase()}
                  </span>
                </div>

                <p class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {project.description}
                </p>

                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-neutral-700 dark:text-neutral-300">Progress</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white">{project.progress}%</span>
                  </div>
                  <div class="relative w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                    <div
                      class="absolute inset-y-0 left-0 bg-gradient-to-r {getProgressColor(project.progress)} rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                      style="width: {project.progress}%"
                    >
                      {#if project.progress > 15}
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                      {/if}
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-1.5">
                  {#each project.tech.slice(0, 3) as tech}
                    <span class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold">
                      {tech}
                    </span>
                  {/each}
                  {#if project.tech.length > 3}
                    <span class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold">
                      +{project.tech.length - 3}
                    </span>
                  {/if}
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                  <div class="flex items-center -space-x-2">
                    {#each project.team.slice(0, 4) as member}
                      <div
                        class="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    {/each}
                    {#if project.team.length > 4}
                      <div class="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 text-xs font-bold">
                        +{project.team.length - 4}
                      </div>
                    {/if}
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-bold border-2 {getStatusColor(project.status)}">
                    {project.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                  <div class="text-center">
                    <p class="text-lg font-black text-neutral-900 dark:text-white">{project.tasks.completed}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Completed</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-black text-info-600 dark:text-info-400">{project.tasks.inProgress}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">In Progress</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-black text-warning-600 dark:text-warning-400">{project.tasks.pending}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Pending</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                  <div class="flex items-center gap-2 text-xs">
                    <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-semibold text-neutral-600 dark:text-neutral-400">{formatDate(project.dueDate)}</span>
                  </div>
                  {#if getDaysRemaining(project.dueDate) > 0}
                    <span class="text-xs font-bold {getDaysRemaining(project.dueDate) <= 7 ? 'text-error-700 dark:text-error-400' : 'text-neutral-600 dark:text-neutral-400'}">
                      {getDaysRemaining(project.dueDate)} days left
                    </span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
