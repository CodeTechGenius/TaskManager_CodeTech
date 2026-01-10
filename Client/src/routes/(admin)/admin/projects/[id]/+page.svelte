<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fly, fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  
  let project = null;
  let loading = true;
  let activeTab = 'overview';
  let showDeleteModal = false;
  
  // Mock data - Replace with actual API call
  const projects = {
    1: {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Complete online shopping solution with payment gateway integration, inventory management, and customer analytics dashboard. This enterprise-level platform includes advanced features like real-time inventory tracking, multi-currency support, and comprehensive analytics.',
      status: 'active',
      progress: 75,
      priority: 'high',
      tech: ['SvelteKit', 'MongoDB', 'Tailwind CSS', 'Stripe', 'Node.js', 'Redis'],
      team: [
        { name: 'John Doe', avatar: 'JD', role: 'Lead Developer', email: 'john@example.com' },
        { name: 'Sarah Smith', avatar: 'SS', role: 'UI/UX Designer', email: 'sarah@example.com' },
        { name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', email: 'mike@example.com' },
        { name: 'Emma Wilson', avatar: 'EW', role: 'QA Engineer', email: 'emma@example.com' },
        { name: 'Alex Brown', avatar: 'AB', role: 'DevOps Engineer', email: 'alex@example.com' }
      ],
      dueDate: '2026-02-15',
      startDate: '2025-11-01',
      budget: 50000,
      spent: 37500,
      client: 'TechCorp Inc.',
      clientContact: {
        name: 'Robert Johnson',
        email: 'robert@techcorp.com',
        phone: '+91 98765 43210'
      },
      tasks: {
        total: 45,
        completed: 34,
        inProgress: 8,
        pending: 3,
        list: [
          { id: 1, title: 'Design Homepage UI', status: 'completed', assignee: 'Sarah Smith', priority: 'high' },
          { id: 2, title: 'Payment Gateway Integration', status: 'in-progress', assignee: 'John Doe', priority: 'urgent' },
          { id: 3, title: 'Inventory Management Module', status: 'in-progress', assignee: 'Mike Johnson', priority: 'high' },
          { id: 4, title: 'User Authentication System', status: 'completed', assignee: 'John Doe', priority: 'high' },
          { id: 5, title: 'Product Catalog Setup', status: 'completed', assignee: 'Sarah Smith', priority: 'medium' }
        ]
      },
      category: 'Web Development',
      icon: '🛒',
      milestones: [
        { id: 1, title: 'Project Kickoff', date: '2025-11-01', status: 'completed', description: 'Initial project setup and team onboarding' },
        { id: 2, title: 'Design Phase Complete', date: '2025-11-20', status: 'completed', description: 'All UI/UX designs approved' },
        { id: 3, title: 'MVP Release', date: '2026-01-15', status: 'completed', description: 'Minimum viable product deployed' },
        { id: 4, title: 'Beta Testing', date: '2026-02-01', status: 'in-progress', description: 'User acceptance testing phase' },
        { id: 5, title: 'Final Delivery', date: '2026-02-15', status: 'pending', description: 'Production deployment' }
      ],
      timeline: [
        { date: '2026-01-10', event: 'Payment module testing completed', type: 'success' },
        { date: '2026-01-09', event: 'New feature request from client', type: 'info' },
        { date: '2026-01-08', event: 'Sprint 5 completed successfully', type: 'success' },
        { date: '2026-01-05', event: 'Security vulnerability fixed', type: 'warning' },
        { date: '2026-01-03', event: 'Database optimization completed', type: 'success' }
      ],
      files: [
        { name: 'Project Requirements.pdf', size: '2.4 MB', type: 'pdf', date: '2025-11-01' },
        { name: 'Design Mockups.fig', size: '15.8 MB', type: 'figma', date: '2025-11-15' },
        { name: 'API Documentation.docx', size: '1.2 MB', type: 'doc', date: '2025-12-10' },
        { name: 'Database Schema.sql', size: '45 KB', type: 'sql', date: '2025-11-20' }
      ],
      metrics: {
        codeCommits: 342,
        pullRequests: 87,
        issuesResolved: 156,
        testCoverage: 85,
        performanceScore: 92
      }
    },
    2: {
      id: 2,
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication, real-time transactions, and investment tracking.',
      status: 'active',
      progress: 60,
      priority: 'urgent',
      tech: ['React Native', 'PostgreSQL', 'Node.js', 'AWS', 'Firebase'],
      team: [
        { name: 'Sarah Smith', avatar: 'SS', role: 'Project Manager', email: 'sarah@example.com' },
        { name: 'Mike Johnson', avatar: 'MJ', role: 'Mobile Developer', email: 'mike@example.com' },
        { name: 'John Doe', avatar: 'JD', role: 'Security Specialist', email: 'john@example.com' },
        { name: 'Lisa Chen', avatar: 'LC', role: 'Backend Developer', email: 'lisa@example.com' }
      ],
      dueDate: '2026-03-01',
      startDate: '2025-10-15',
      budget: 80000,
      spent: 48000,
      client: 'FinanceBank Ltd.',
      clientContact: {
        name: 'David Wilson',
        email: 'david@financebank.com',
        phone: '+91 98765 43211'
      },
      tasks: {
        total: 62,
        completed: 37,
        inProgress: 18,
        pending: 7,
        list: [
          { id: 1, title: 'Biometric Authentication', status: 'completed', assignee: 'John Doe', priority: 'urgent' },
          { id: 2, title: 'Transaction History UI', status: 'in-progress', assignee: 'Mike Johnson', priority: 'high' },
          { id: 3, title: 'Security Audit', status: 'in-progress', assignee: 'John Doe', priority: 'high' }
        ]
      },
      category: 'Mobile Development',
      icon: '📱',
      milestones: [
        { id: 1, title: 'Project Kickoff', date: '2025-10-15', status: 'completed', description: 'Initial setup' },
        { id: 2, title: 'Core Features', date: '2026-01-20', status: 'in-progress', description: 'Main functionality development' },
        { id: 3, title: 'Security Testing', date: '2026-02-15', status: 'pending', description: 'Comprehensive security audit' },
        { id: 4, title: 'Launch', date: '2026-03-01', status: 'pending', description: 'Production release' }
      ],
      timeline: [
        { date: '2026-01-10', event: 'Security features implemented', type: 'success' },
        { date: '2026-01-08', event: 'Performance optimization completed', type: 'success' }
      ],
      files: [
        { name: 'App Design.sketch', size: '25.3 MB', type: 'sketch', date: '2025-10-20' },
        { name: 'Security Protocols.pdf', size: '3.1 MB', type: 'pdf', date: '2025-11-05' }
      ],
      metrics: {
        codeCommits: 456,
        pullRequests: 112,
        issuesResolved: 203,
        testCoverage: 92,
        performanceScore: 88
      }
    }
  };

  onMount(async () => {
    await loadProject();
  });

  async function loadProject() {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const projectId = parseInt($page.params.id);
      project = projects[projectId] || null;
      
      if (!project) {
        goto('/admin/projects');
      }
      
      loading = false;
    } catch (error) {
      console.error('Error loading project:', error);
      loading = false;
      goto('/admin/projects');
    }
  }

  function getStatusColor(status) {
    const colors = {
      active: 'bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400 dark:border-success-700',
      completed: 'bg-info-100 text-info-700 border-info-300 dark:bg-info-900/30 dark:text-info-400 dark:border-info-700',
      'on-hold': 'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-700',
      planning: 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600',
      pending: 'bg-error-100 text-error-700 border-error-300 dark:bg-error-900/30 dark:text-error-400',
      'in-progress': 'bg-info-100 text-info-700 border-info-300 dark:bg-info-900/30 dark:text-info-400'
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

  function editProject() {
    goto(`/admin/projects/${project.id}/edit`);
  }

  function deleteProject() {
    showDeleteModal = true;
  }

  function confirmDelete() {
    // Implement delete logic
    showDeleteModal = false;
    goto('/admin/projects');
  }

  function downloadFile(file) {
    // Implement file download
    console.log('Downloading:', file.name);
  }
</script>

<svelte:head>
  <title>{project ? project.name : 'Project'} - Task Manager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  {#if loading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 font-bold text-lg">Loading project...</p>
      </div>
    </div>
  {:else if project}
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- Breadcrumb & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav class="flex items-center gap-2 text-sm">
          <button
            on:click={() => goto('/admin/projects')}
            class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
          >
            Projects
          </button>
          <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-neutral-900 dark:text-white font-bold">{project.name}</span>
        </nav>
        
        <div class="flex items-center gap-2">
          <button
            on:click={editProject}
            class="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-neutral-700 dark:text-neutral-300 hover:border-primary-500 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit
          </button>
          <button
            on:click={deleteProject}
            class="px-4 py-2 bg-error-100 dark:bg-error-900/30 border-2 border-error-200 dark:border-error-800 rounded-xl font-bold text-error-700 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-900/50 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Project Header -->
      <div class="relative rounded-3xl shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div class="relative p-6 lg:p-10 text-white">
          <div class="flex flex-col lg:flex-row gap-6">
            <div class="flex-1 space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl text-4xl lg:text-5xl flex-shrink-0">
                  {project.icon}
                </div>
                <div class="flex-1">
                  <h1 class="text-3xl lg:text-4xl font-black tracking-tight mb-2">{project.name}</h1>
                  <p class="text-primary-100 text-sm lg:text-base font-medium">
                    {project.description}
                  </p>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-3">
                <span class="px-4 py-2 rounded-xl text-sm font-bold border-2 {getStatusColor(project.status)} bg-white/10 backdrop-blur-md">
                  {project.status.replace('-', ' ').toUpperCase()}
                </span>
                <span class="px-4 py-2 rounded-xl text-sm font-bold {getPriorityColor(project.priority)} bg-white/10 backdrop-blur-md">
                  {project.priority.toUpperCase()} PRIORITY
                </span>
                <span class="px-4 py-2 rounded-xl text-sm font-bold bg-white/10 backdrop-blur-md border-2 border-white/20">
                  {project.category}
                </span>
              </div>
            </div>

            <!-- Progress Circle -->
            <div class="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20">
              <div class="relative w-32 h-32">
                <svg class="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    stroke-width="12"
                    fill="transparent"
                    class="text-white/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    stroke-width="12"
                    fill="transparent"
                    stroke-dasharray="351.86"
                    stroke-dashoffset="{351.86 - (351.86 * project.progress) / 100}"
                    class="text-white transition-all duration-1000"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-4xl font-black">{project.progress}%</span>
                  <span class="text-xs font-semibold text-white/80">Complete</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p class="text-white/70 text-sm font-semibold mb-1">Team Members</p>
              <p class="text-2xl font-black">{project.team.length}</p>
            </div>
            <div>
              <p class="text-white/70 text-sm font-semibold mb-1">Tasks Completed</p>
              <p class="text-2xl font-black">{project.tasks.completed}/{project.tasks.total}</p>
            </div>
            <div>
              <p class="text-white/70 text-sm font-semibold mb-1">Budget Spent</p>
              <p class="text-2xl font-black">{Math.round((project.spent / project.budget) * 100)}%</p>
            </div>
            <div>
              <p class="text-white/70 text-sm font-semibold mb-1">Days Remaining</p>
              <p class="text-2xl font-black">{getDaysRemaining(project.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border-2 border-neutral-200 dark:border-neutral-700 p-2">
        <div class="flex flex-wrap gap-2">
          <button
            on:click={() => activeTab = 'overview'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'overview'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Overview
          </button>
          <button
            on:click={() => activeTab = 'tasks'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'tasks'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Tasks ({project.tasks.total})
          </button>
          <button
            on:click={() => activeTab = 'team'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'team'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Team ({project.team.length})
          </button>
          <button
            on:click={() => activeTab = 'milestones'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'milestones'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Milestones
          </button>
          <button
            on:click={() => activeTab = 'files'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'files'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Files ({project.files.length})
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          {#if activeTab === 'overview'}
            <!-- Budget & Timeline -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Budget Card -->
              <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span class="text-2xl">💰</span>
                    Budget
                  </h3>
                  <span class="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                    {Math.round((project.spent / project.budget) * 100)}% Used
                  </span>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <div class="flex justify-between text-sm mb-2">
                      <span class="font-semibold text-neutral-700 dark:text-neutral-300">Total Budget</span>
                      <span class="font-black text-neutral-900 dark:text-white">{formatCurrency(project.budget)}</span>
                    </div>
                    <div class="flex justify-between text-sm mb-2">
                      <span class="font-semibold text-neutral-700 dark:text-neutral-300">Spent</span>
                      <span class="font-black text-error-600 dark:text-error-400">{formatCurrency(project.spent)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="font-semibold text-neutral-700 dark:text-neutral-300">Remaining</span>
                      <span class="font-black text-success-600 dark:text-success-400">{formatCurrency(project.budget - project.spent)}</span>
                    </div>
                  </div>

                  <div class="relative w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-4 overflow-hidden">
                    <div
                      class="absolute inset-y-0 left-0 bg-gradient-to-r from-success-500 to-info-600 rounded-full transition-all duration-700"
                      style="width: {(project.spent / project.budget) * 100}%"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Timeline Card -->
              <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
                <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <span class="text-2xl">📅</span>
                  Timeline
                </h3>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Start Date</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white">{formatDate(project.startDate)}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Due Date</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white">{formatDate(project.dueDate)}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Days Remaining</span>
                    <span class="text-sm font-black {getDaysRemaining(project.dueDate) <= 7 ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}">
                      {getDaysRemaining(project.dueDate)} days
                    </span>
                  </div>

                  <div class="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div class="flex items-center gap-2 text-sm">
                      <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="font-semibold text-neutral-600 dark:text-neutral-400">
                        Project duration: {Math.ceil((new Date(project.dueDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Technology Stack -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <span class="text-2xl">⚙️</span>
                Technology Stack
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each project.tech as tech}
                  <span class="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl text-sm font-bold">
                    {tech}
                  </span>
                {/each}
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <span class="text-2xl">📝</span>
                Recent Activity
              </h3>
              <div class="space-y-3">
                {#each project.timeline as activity}
                  <div class="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white flex-shrink-0">
                      {#if activity.type === 'success'}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      {:else if activity.type === 'warning'}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                      {:else}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      {/if}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-bold text-neutral-900 dark:text-white">{activity.event}</p>
                      <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold mt-1">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Project Metrics -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <span class="text-2xl">📊</span>
                Project Metrics
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800">
                  <p class="text-3xl font-black text-primary-700 dark:text-primary-400">{project.metrics.codeCommits}</p>
                  <p class="text-xs font-semibold text-primary-600 dark:text-primary-500 mt-1">Code Commits</p>
                </div>
                <div class="p-4 rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 border border-secondary-200 dark:border-secondary-800">
                  <p class="text-3xl font-black text-secondary-700 dark:text-secondary-400">{project.metrics.pullRequests}</p>
                  <p class="text-xs font-semibold text-secondary-600 dark:text-secondary-500 mt-1">Pull Requests</p>
                </div>
                <div class="p-4 rounded-2xl bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border border-success-200 dark:border-success-800">
                  <p class="text-3xl font-black text-success-700 dark:text-success-400">{project.metrics.issuesResolved}</p>
                  <p class="text-xs font-semibold text-success-600 dark:text-success-500 mt-1">Issues Resolved</p>
                </div>
                <div class="p-4 rounded-2xl bg-gradient-to-br from-info-50 to-info-100 dark:from-info-900/20 dark:to-info-800/20 border border-info-200 dark:border-info-800">
                  <p class="text-3xl font-black text-info-700 dark:text-info-400">{project.metrics.testCoverage}%</p>
                  <p class="text-xs font-semibold text-info-600 dark:text-info-500 mt-1">Test Coverage</p>
                </div>
                <div class="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 border border-accent-200 dark:border-accent-800">
                  <p class="text-3xl font-black text-accent-700 dark:text-accent-400">{project.metrics.performanceScore}%</p>
                  <p class="text-xs font-semibold text-accent-600 dark:text-accent-500 mt-1">Performance</p>
                </div>
              </div>
            </div>

          {:else if activeTab === 'tasks'}
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-black text-neutral-900 dark:text-white">Project Tasks</h3>
                <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all">
                  Add Task
                </button>
              </div>
              <div class="space-y-3">
                {#each project.tasks.list as task}
                  <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all cursor-pointer">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex-1">
                        <h4 class="font-bold text-neutral-900 dark:text-white mb-1">{task.title}</h4>
                        <div class="flex items-center gap-3 text-xs">
                          <span class="px-2 py-1 rounded-lg {getStatusColor(task.status)} font-semibold">
                            {task.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span class="px-2 py-1 rounded-lg {getPriorityColor(task.priority)} font-semibold">
                            {task.priority.toUpperCase()}
                          </span>
                          <span class="text-neutral-600 dark:text-neutral-400 font-semibold">👤 {task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

          {:else if activeTab === 'team'}
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-6">Team Members</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each project.team as member}
                  <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        {member.avatar}
                      </div>
                      <div class="flex-1">
                        <h4 class="font-black text-neutral-900 dark:text-white">{member.name}</h4>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">{member.role}</p>
                        <p class="text-xs text-neutral-500 dark:text-neutral-500 font-medium">{member.email}</p>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

          {:else if activeTab === 'milestones'}
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-6">Project Milestones</h3>
              <div class="space-y-4">
                {#each project.milestones as milestone, index}
                  <div class="relative pl-8 pb-8 {index === project.milestones.length - 1 ? 'pb-0' : ''}">
                    {#if index !== project.milestones.length - 1}
                      <div class="absolute left-3 top-8 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700"></div>
                    {/if}
                    <div class="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-br {milestone.status === 'completed' ? 'from-success-400 to-success-600' : milestone.status === 'in-progress' ? 'from-info-400 to-info-600' : 'from-neutral-400 to-neutral-600'} flex items-center justify-center text-white">
                      {#if milestone.status === 'completed'}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      {:else if milestone.status === 'in-progress'}
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      {:else}
                        <div class="w-2 h-2 bg-white rounded-full"></div>
                      {/if}
                    </div>
                    <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700">
                      <div class="flex items-start justify-between gap-3 mb-2">
                        <h4 class="font-black text-neutral-900 dark:text-white">{milestone.title}</h4>
                        <span class="px-3 py-1 rounded-full text-xs font-bold {getStatusColor(milestone.status)}">
                          {milestone.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{milestone.description}</p>
                      <p class="text-xs text-neutral-500 dark:text-neutral-500 font-semibold">📅 {formatDate(milestone.date)}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

          {:else if activeTab === 'files'}
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-black text-neutral-900 dark:text-white">Project Files</h3>
                <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all">
                  Upload File
                </button>
              </div>
              <div class="space-y-3">
                {#each project.files as file}
                  <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all cursor-pointer group">
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3 flex-1">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h4 class="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">{file.name}</h4>
                          <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{file.size} • {formatDate(file.date)}</p>
                        </div>
                      </div>
                      <button
                        on:click={() => downloadFile(file)}
                        class="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-all"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Client Info -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">👤</span>
              Client Information
            </h3>
            <div class="space-y-3">
              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Company</p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{project.client}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Contact Person</p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{project.clientContact.name}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Email</p>
                <p class="text-sm font-bold text-primary-600 dark:text-primary-400">{project.clientContact.email}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Phone</p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{project.clientContact.phone}</p>
              </div>
            </div>
          </div>

          <!-- Task Summary -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">✅</span>
              Task Summary
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                <span class="text-sm font-semibold text-success-700 dark:text-success-400">Completed</span>
                <span class="text-lg font-black text-success-700 dark:text-success-400">{project.tasks.completed}</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800">
                <span class="text-sm font-semibold text-info-700 dark:text-info-400">In Progress</span>
                <span class="text-lg font-black text-info-700 dark:text-info-400">{project.tasks.inProgress}</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
                <span class="text-sm font-semibold text-error-700 dark:text-error-400">Pending</span>
                <span class="text-lg font-black text-error-700 dark:text-error-400">{project.tasks.pending}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full px-4 py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-all text-left flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add New Task
              </button>
              <button class="w-full px-4 py-3 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 font-bold rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-800/40 transition-all text-left flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Invite Team Member
              </button>
              <button class="w-full px-4 py-3 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 font-bold rounded-xl hover:bg-accent-200 dark:hover:bg-accent-800/40 transition-all text-left flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade>
    <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-full" in:scale={{ duration: 300 }}>
      <h3 class="text-2xl font-black text-neutral-900 dark:text-white mb-4">Delete Project?</h3>
      <p class="text-neutral-600 dark:text-neutral-400 mb-6">
        Are you sure you want to delete this project? This action cannot be undone.
      </p>
      <div class="flex gap-3">
        <button
          on:click={() => showDeleteModal = false}
          class="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
        >
          Cancel
        </button>
        <button
          on:click={confirmDelete}
          class="flex-1 px-4 py-3 bg-error-600 hover:bg-error-700 text-white font-bold rounded-xl transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}
