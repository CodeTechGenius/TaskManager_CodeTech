<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade, scale } from 'svelte/transition';
  
  let loading = true;
  let searchQuery = '';
  let selectedProject = 'all';
  let selectedStatus = 'all';
  let selectedPriority = 'all';
  let selectedSort = 'recent';
  let showApprovalModal = false;
  let selectedTaskForApproval = null;
  let adjustedTime = '';
  let approvalNotes = '';
  let assignmentNotes = '';
  let showAssignModal = false;
  let selectedTaskForAssign = null;
  let selectedEmployee = '';

  // Projects List
  let projects = [
    { id: 'all', name: 'All Projects', icon: '📋', color: 'from-neutral-500 to-neutral-600' },
    { id: 1, name: 'E-commerce Platform', icon: '🛒', color: 'from-blue-500 to-blue-600' },
    { id: 2, name: 'CRM Dashboard', icon: '📊', color: 'from-purple-500 to-purple-600' },
    { id: 3, name: 'Healthcare Portal', icon: '🏥', color: 'from-green-500 to-green-600' },
    { id: 4, name: 'Mobile Banking App', icon: '📱', color: 'from-orange-500 to-orange-600' },
    { id: 5, name: 'Real Estate Marketplace', icon: '🏠', color: 'from-red-500 to-red-600' },
    { id: 6, name: 'Learning Management System', icon: '📚', color: 'from-indigo-500 to-indigo-600' }
  ];

  // Team Members
  let teamMembers = [
    { id: 1, name: 'John Doe', avatar: 'JD', role: 'Lead Developer', workload: 3 },
    { id: 2, name: 'Sarah Smith', avatar: 'SS', role: 'UI/UX Designer', workload: 2 },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', workload: 4 },
    { id: 4, name: 'Emma Wilson', avatar: 'EW', role: 'Full Stack Developer', workload: 3 },
    { id: 5, name: 'Alex Brown', avatar: 'AB', role: 'DevOps Engineer', workload: 2 },
    { id: 6, name: 'Lisa Chen', avatar: 'LC', role: 'Frontend Developer', workload: 3 },
    { id: 7, name: 'Tom Harris', avatar: 'TH', role: 'Backend Developer', workload: 2 }
  ];

  // All Tasks with workflow states
  let allTasks = [
    // NEW REQUESTS - Employees requesting task assignments
    {
      id: 1,
      title: 'Implement OAuth 2.0 Authentication',
      description: 'Integrate OAuth 2.0 authentication with Google and Facebook providers.',
      status: 'new_request',
      priority: 'urgent',
      projectId: 1,
      projectName: 'E-commerce Platform',
      projectIcon: '🛒',
      projectColor: 'from-blue-500 to-blue-600',
      requestedBy: { name: 'Sarah Johnson', avatar: 'SJ', role: 'Project Manager' },
      requestedDate: '2026-01-12',
      deadline: '2026-01-18',
      daysLeft: 5
    },
    {
      id: 2,
      title: 'Design User Dashboard Mockups',
      description: 'Create high-fidelity mockups for the user dashboard.',
      status: 'new_request',
      priority: 'high',
      projectId: 2,
      projectName: 'CRM Dashboard',
      projectIcon: '📊',
      projectColor: 'from-purple-500 to-purple-600',
      requestedBy: { name: 'Mike Brown', avatar: 'MB', role: 'Lead Designer' },
      requestedDate: '2026-01-11',
      deadline: '2026-01-20',
      daysLeft: 7
    },
    {
      id: 3,
      title: 'API Performance Optimization',
      description: 'Optimize database queries and implement caching strategies.',
      status: 'new_request',
      priority: 'medium',
      projectId: 3,
      projectName: 'Healthcare Portal',
      projectIcon: '🏥',
      projectColor: 'from-green-500 to-green-600',
      requestedBy: { name: 'David Wilson', avatar: 'DW', role: 'Tech Lead' },
      requestedDate: '2026-01-10',
      deadline: '2026-01-22',
      daysLeft: 9
    },

    // EMPLOYEE ACCEPTED - Waiting for Admin Approval
    {
      id: 4,
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe payment gateway with order processing.',
      status: 'employee_accepted',
      priority: 'urgent',
      projectId: 1,
      projectName: 'E-commerce Platform',
      projectIcon: '🛒',
      projectColor: 'from-blue-500 to-blue-600',
      assignee: { name: 'John Doe', avatar: 'JD', role: 'Backend Developer' },
      estimatedTime: '16 hours',
      employeeNotes: 'Will implement Stripe API with webhook handlers for payment processing and invoice generation.',
      submittedDate: '2026-01-11',
      deadline: '2026-01-15',
      daysLeft: 2
    },
    {
      id: 5,
      title: 'Database Migration Script',
      description: 'Create migration scripts for new database schema with rollback support.',
      status: 'employee_accepted',
      priority: 'high',
      projectId: 2,
      projectName: 'CRM Dashboard',
      projectIcon: '📊',
      projectColor: 'from-purple-500 to-purple-600',
      assignee: { name: 'Alex Brown', avatar: 'AB', role: 'DevOps Engineer' },
      estimatedTime: '12 hours',
      employeeNotes: 'Including rollback scripts, data validation, and testing procedures.',
      submittedDate: '2026-01-10',
      deadline: '2026-01-17',
      daysLeft: 4
    },

    // IN PROGRESS - Admin Approved
    {
      id: 6,
      title: 'User Authentication Module',
      description: 'Implement JWT-based authentication system with email verification.',
      status: 'in-progress',
      priority: 'high',
      projectId: 3,
      projectName: 'Healthcare Portal',
      projectIcon: '🏥',
      projectColor: 'from-green-500 to-green-600',
      assignee: { name: 'Emma Wilson', avatar: 'EW', role: 'Full Stack Developer' },
      approvedTime: '20 hours',
      timeSpent: '15 hours',
      progress: 75,
      dueDate: '2026-01-18',
      startDate: '2026-01-08',
      daysLeft: 5
    },
    {
      id: 7,
      title: 'API Documentation',
      description: 'Create comprehensive API documentation using Swagger/OpenAPI.',
      status: 'in-progress',
      priority: 'medium',
      projectId: 2,
      projectName: 'CRM Dashboard',
      projectIcon: '📊',
      projectColor: 'from-purple-500 to-purple-600',
      assignee: { name: 'Tom Harris', avatar: 'TH', role: 'Backend Developer' },
      approvedTime: '10 hours',
      timeSpent: '4.5 hours',
      progress: 45,
      dueDate: '2026-01-20',
      startDate: '2026-01-09',
      daysLeft: 7
    },
    {
      id: 8,
      title: 'Mobile App UI Components',
      description: 'Build reusable UI component library for mobile app.',
      status: 'in-progress',
      priority: 'high',
      projectId: 4,
      projectName: 'Mobile Banking App',
      projectIcon: '📱',
      projectColor: 'from-orange-500 to-orange-600',
      assignee: { name: 'Sarah Smith', avatar: 'SS', role: 'UI/UX Designer' },
      approvedTime: '18 hours',
      timeSpent: '10.8 hours',
      progress: 60,
      dueDate: '2026-01-16',
      startDate: '2026-01-07',
      daysLeft: 3
    },
    {
      id: 9,
      title: 'Email Notification System',
      description: 'Implement email notification service with templates.',
      status: 'in-progress',
      priority: 'medium',
      projectId: 1,
      projectName: 'E-commerce Platform',
      projectIcon: '🛒',
      projectColor: 'from-blue-500 to-blue-600',
      assignee: { name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer' },
      approvedTime: '14 hours',
      timeSpent: '4.2 hours',
      progress: 30,
      dueDate: '2026-01-25',
      startDate: '2026-01-10',
      daysLeft: 12
    },
    {
      id: 10,
      title: 'Search Functionality',
      description: 'Implement advanced search with filters and sorting.',
      status: 'in-progress',
      priority: 'low',
      projectId: 3,
      projectName: 'Healthcare Portal',
      projectIcon: '🏥',
      projectColor: 'from-green-500 to-green-600',
      assignee: { name: 'Lisa Chen', avatar: 'LC', role: 'Frontend Developer' },
      approvedTime: '8 hours',
      timeSpent: '1.6 hours',
      progress: 20,
      dueDate: '2026-01-28',
      startDate: '2026-01-11',
      daysLeft: 15
    },

    // COMPLETED
    {
      id: 11,
      title: 'Homepage UI Design',
      description: 'Complete homepage design with all sections.',
      status: 'completed',
      priority: 'high',
      projectId: 1,
      projectName: 'E-commerce Platform',
      projectIcon: '🛒',
      projectColor: 'from-blue-500 to-blue-600',
      assignee: { name: 'Sarah Smith', avatar: 'SS', role: 'UI/UX Designer' },
      approvedTime: '16 hours',
      timeSpent: '14 hours',
      completedDate: '2026-01-09',
      dueDate: '2026-01-09'
    },
    {
      id: 12,
      title: 'User Profile Page',
      description: 'Design and implement user profile page with edit functionality.',
      status: 'completed',
      priority: 'medium',
      projectId: 2,
      projectName: 'CRM Dashboard',
      projectIcon: '📊',
      projectColor: 'from-purple-500 to-purple-600',
      assignee: { name: 'John Doe', avatar: 'JD', role: 'Lead Developer' },
      approvedTime: '10 hours',
      timeSpent: '8 hours',
      completedDate: '2026-01-08',
      dueDate: '2026-01-08'
    },
    {
      id: 13,
      title: 'Login Flow Optimization',
      description: 'Optimize login user experience with better error handling.',
      status: 'completed',
      priority: 'high',
      projectId: 3,
      projectName: 'Healthcare Portal',
      projectIcon: '🏥',
      projectColor: 'from-green-500 to-green-600',
      assignee: { name: 'Emma Wilson', avatar: 'EW', role: 'Full Stack Developer' },
      approvedTime: '12 hours',
      timeSpent: '12 hours',
      completedDate: '2026-01-07',
      dueDate: '2026-01-07'
    },
    {
      id: 14,
      title: 'Dashboard Charts Integration',
      description: 'Integrate interactive charts and data visualization.',
      status: 'completed',
      priority: 'medium',
      projectId: 2,
      projectName: 'CRM Dashboard',
      projectIcon: '📊',
      projectColor: 'from-purple-500 to-purple-600',
      assignee: { name: 'Alex Brown', avatar: 'AB', role: 'DevOps Engineer' },
      approvedTime: '11 hours',
      timeSpent: '10 hours',
      completedDate: '2026-01-06',
      dueDate: '2026-01-06'
    },
    {
      id: 15,
      title: 'Form Validation System',
      description: 'Build reusable form validation library.',
      status: 'completed',
      priority: 'low',
      projectId: 1,
      projectName: 'E-commerce Platform',
      projectIcon: '🛒',
      projectColor: 'from-blue-500 to-blue-600',
      assignee: { name: 'Tom Harris', avatar: 'TH', role: 'Backend Developer' },
      approvedTime: '8 hours',
      timeSpent: '6 hours',
      completedDate: '2026-01-05',
      dueDate: '2026-01-05'
    }
  ];

  let filteredTasks = [];
  let stats = {
    totalTasks: 15,
    newRequests: 3,
    pendingApproval: 2,
    inProgress: 5,
    completed: 5
  };

  const statusFilters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'new_request', label: 'New Requests' },
    { id: 'employee_accepted', label: 'Pending Approval' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { id: 'all', label: 'All Priorities' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' }
  ];

  onMount(async () => {
    await loadTasks();
  });

  async function loadTasks() {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      applyFilters();
      loading = false;
    } catch (error) {
      console.error('Error loading tasks:', error);
      loading = false;
    }
  }

  function applyFilters() {
    let tasks = [...allTasks];

    if (selectedProject !== 'all') {
      tasks = tasks.filter(t => t.projectId === selectedProject);
    }

    if (selectedStatus !== 'all') {
      tasks = tasks.filter(t => t.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      tasks = tasks.filter(t => t.priority === selectedPriority);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.projectName.toLowerCase().includes(query)
      );
    }

    tasks = sortTasks(tasks);
    filteredTasks = tasks;
  }

  function sortTasks(tasks) {
    switch(selectedSort) {
      case 'recent':
        return tasks.sort((a, b) => b.id - a.id);
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'deadline':
        return tasks.sort((a, b) => {
          const dateA = a.deadline || a.dueDate || '9999-12-31';
          const dateB = b.deadline || b.dueDate || '9999-12-31';
          return new Date(dateA) - new Date(dateB);
        });
      default:
        return tasks;
    }
  }

  $: {
    searchQuery;
    selectedProject;
    selectedStatus;
    selectedPriority;
    selectedSort;
    applyFilters();
  }

  function openAssignModal(task) {
    selectedTaskForAssign = task;
    selectedEmployee = '';
    assignmentNotes = '';
    showAssignModal = true;
  }

  function closeAssignModal() {
    showAssignModal = false;
    selectedTaskForAssign = null;
    selectedEmployee = '';
    assignmentNotes = '';
  }

  async function assignTaskToEmployee() {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    const employee = teamMembers.find(m => m.id === parseInt(selectedEmployee));
    if (employee) {
      const taskIndex = allTasks.findIndex(t => t.id === selectedTaskForAssign.id);
      if (taskIndex !== -1) {
        allTasks[taskIndex].assignee = {
          name: employee.name,
          avatar: employee.avatar,
          role: employee.role
        };
        allTasks[taskIndex].status = 'employee_accepted';
        allTasks = [...allTasks];
        applyFilters();
        closeAssignModal();
        showSuccessToast(`Task assigned to ${employee.name}`);
      }
    }
  }

  function openApprovalModal(task) {
    selectedTaskForApproval = task;
    adjustedTime = task.estimatedTime || '';
    approvalNotes = '';
    showApprovalModal = true;
  }

  function closeApprovalModal() {
    showApprovalModal = false;
    selectedTaskForApproval = null;
    adjustedTime = '';
    approvalNotes = '';
  }

  async function approveTask() {
    if (!adjustedTime) {
      alert('Please specify approved time');
      return;
    }

    const taskIndex = allTasks.findIndex(t => t.id === selectedTaskForApproval.id);
    if (taskIndex !== -1) {
      allTasks[taskIndex].status = 'in-progress';
      allTasks[taskIndex].approvedTime = adjustedTime;
      allTasks[taskIndex].startDate = new Date().toISOString().split('T')[0];
      allTasks[taskIndex].progress = 0;
      allTasks[taskIndex].timeSpent = '0 hours';
      
      allTasks = [...allTasks];
      applyFilters();
    }

    closeApprovalModal();
    showSuccessToast('Task approved! Employee can start working.');
  }

  async function rejectTask() {
    if (!approvalNotes) {
      alert('Please provide rejection reason');
      return;
    }

    const taskIndex = allTasks.findIndex(t => t.id === selectedTaskForApproval.id);
    if (taskIndex !== -1) {
      allTasks.splice(taskIndex, 1);
      allTasks = [...allTasks];
      applyFilters();
    }

    closeApprovalModal();
    showSuccessToast('Task rejected and sent back to employee.');
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
      new_request: { label: 'New Request', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800' },
      employee_accepted: { label: 'Pending Approval', color: 'bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400 border-info-200 dark:border-info-800' },
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
    goto(`/admin/tasks/${id}`);
  }

  function createNewTask() {
    goto('/admin/tasks/new');
  }

  function clearFilters() {
    searchQuery = '';
    selectedProject = 'all';
    selectedStatus = 'all';
    selectedPriority = 'all';
  }

  let showSuccessToastFlag = false;
  let successToastMessage = '';

  function showSuccessToast(message) {
    successToastMessage = message;
    showSuccessToastFlag = true;
    setTimeout(() => {
      showSuccessToastFlag = false;
    }, 3000);
  }
</script>

<svelte:head>
  <title>Task Management - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
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
      
      <!-- Page Header with Project Selector -->
      <div class="relative rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r {selectedProject !== 'all' ? projects.find(p => p.id === selectedProject)?.color || 'from-primary-600 to-primary-700' : 'from-primary-700 to-primary-600'}"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div class="relative p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 text-white">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="text-4xl lg:text-5xl">
                  {selectedProject !== 'all' ? projects.find(p => p.id === selectedProject)?.icon || '📋' : '📋'}
                </span>
                <div>
                  <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black">
                    {selectedProject !== 'all' ? projects.find(p => p.id === selectedProject)?.name || 'Task Management' : 'Task Management'}
                  </h1>
                  <p class="text-sm sm:text-base lg:text-lg text-white/80 font-semibold">Project-wise task assignment & approval</p>
                </div>
              </div>
            </div>
            <button
              on:click={createNewTask}
              class="px-4 lg:px-6 py-2.5 lg:py-3 bg-white hover:bg-neutral-50 text-primary-700 rounded-xl lg:rounded-2xl shadow-xl text-sm lg:text-base font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Create Task
            </button>
          </div>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{stats.totalTasks}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Total Tasks</p>
            </div>
            <div class="bg-warning-500/20 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-warning-400/30">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{stats.newRequests}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">New Requests</p>
            </div>
            <div class="bg-info-500/20 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-info-400/30">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{stats.pendingApproval}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Pending Approval</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{stats.inProgress}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">In Progress</p>
            </div>
            <div class="bg-success-500/20 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-success-400/30">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-black mb-1">{stats.completed}</p>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Selector Pills -->
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {#each projects as project}
          <button
            on:click={() => selectedProject = project.id}
            class="flex items-center gap-1 px-4 py-2.5 m-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 {
              selectedProject === project.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500 scale-105'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-700'
            }"
          >
            <span class="text-xl">{project.icon}</span>
            {project.name}
          </button>
        {/each}
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
                placeholder="Search tasks..."
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-3.5 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl lg:rounded-2xl text-sm lg:text-base text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-2 lg:gap-3">
            <select
              bind:value={selectedStatus}
              class="px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm lg:text-base text-neutral-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {#each statusFilters as option}
                <option value={option.id}>{option.label}</option>
              {/each}
            </select>

            <select
              bind:value={selectedPriority}
              class="px-3 sm:px-4 py-2.5 sm:py-3  bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm lg:text-base text-neutral-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {#each priorityOptions as option}
                <option value={option.id}>{option.label}</option>
              {/each}
            </select>

            <select
              bind:value={selectedSort}
              class="px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm lg:text-base text-neutral-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="recent">Recent</option>
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
            </select>

            {#if searchQuery || selectedProject !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all'}
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
          <p class="text-sm lg:text-base text-neutral-600 dark:text-neutral-400 mb-6">Try adjusting your filters</p>
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
              <div class="h-1.5 bg-gradient-to-r {task.projectColor}"></div>
              
              <div class="p-4 sm:p-5 lg:p-6 xl:p-8">
                <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  <div class="flex-1 space-y-3 lg:space-y-4">
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

                    <div class="flex items-center gap-2">
                      <span class="text-2xl">{task.projectIcon}</span>
                      <span class="text-sm lg:text-base font-bold text-primary-600 dark:text-primary-400">{task.projectName}</span>
                    </div>

                    <p class="text-sm lg:text-base text-neutral-700 dark:text-neutral-300 line-clamp-2">{task.description}</p>

                    <div class="flex flex-wrap gap-3 lg:gap-4 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                      {#if task.requestedBy}
                        <div class="flex items-center gap-1.5">
                          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xs font-bold">
                            {task.requestedBy.avatar}
                          </div>
                          <span class="font-semibold">Requested by: {task.requestedBy.name}</span>
                        </div>
                      {/if}

                      {#if task.assignee}
                        <div class="flex items-center gap-1.5">
                          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold">
                            {task.assignee.avatar}
                          </div>
                          <span class="font-bold">Assigned: {task.assignee.name}</span>
                        </div>
                      {/if}

                      {#if task.estimatedTime}
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span class="font-bold">Est: {task.estimatedTime}</span>
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
                    </div>

                    {#if task.employeeNotes}
                      <div class="p-3 bg-info-50 dark:bg-info-900/20 rounded-xl border-2 border-info-200 dark:border-info-800">
                        <p class="text-xs lg:text-sm font-semibold text-info-800 dark:text-info-300">
                          <strong>Employee Notes:</strong> {task.employeeNotes}
                        </p>
                      </div>
                    {/if}

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

                  <!-- Action Buttons -->
                  <div class="flex lg:flex-col justify-end items-center gap-2 lg:gap-3 flex-shrink-0">
                    {#if task.status === 'new_request'}
                      <button
                        on:click={() => openAssignModal(task)}
                        class="flex-1 lg:flex-none px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                        </svg>
                        Assign Task
                      </button>
                    {:else if task.status === 'employee_accepted'}
                      <button
                        on:click={() => openApprovalModal(task)}
                        class="flex-1 lg:flex-none px-4 py-2.5 bg-success-600 hover:bg-success-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Review & Approve
                      </button>
                    {:else}
                      <button
                        on:click={() => viewTask(task.id)}
                        class="flex-1 lg:flex-none px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View Details
                      </button>
                    {/if}
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

<!-- Assignment Modal -->
{#if showAssignModal && selectedTaskForAssign}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade on:click={closeAssignModal}>
    <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation transition:scale>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl lg:text-2xl font-black text-neutral-900 dark:text-white">Assign Task to Employee</h3>
        <button
          on:click={closeAssignModal}
          class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
        >
          <svg class="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 lg:p-6 mb-6 border-2 border-neutral-200 dark:border-neutral-700">
        <h4 class="text-lg lg:text-xl font-black text-neutral-900 dark:text-white mb-3">{selectedTaskForAssign.title}</h4>
        <p class="text-sm lg:text-base text-neutral-700 dark:text-neutral-300 mb-4">{selectedTaskForAssign.description}</p>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Project:</p>
            <p class="font-bold text-neutral-900 dark:text-white">{selectedTaskForAssign.projectName}</p>
          </div>
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Priority:</p>
            <span class="px-2 py-1 rounded text-xs font-bold {getPriorityColor(selectedTaskForAssign.priority)}">{selectedTaskForAssign.priority.toUpperCase()}</span>
          </div>
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Deadline:</p>
            <p class="font-bold text-neutral-900 dark:text-white">{formatDate(selectedTaskForAssign.deadline)}</p>
          </div>
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Days Left:</p>
            <p class="font-bold text-neutral-900 dark:text-white">{selectedTaskForAssign.daysLeft} days</p>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div>
          <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
            Select Employee *
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {#each teamMembers as member}
              <button
                type="button"
                on:click={() => selectedEmployee = member.id.toString()}
                class="p-4 rounded-xl border-2 transition-all text-left {
                  selectedEmployee === member.id.toString()
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-2 ring-primary-500/30'
                    : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-primary-500'
                }"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-sm font-bold">
                    {member.avatar}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-neutral-900 dark:text-white">{member.name}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{member.role}</p>
                  </div>
                  {#if selectedEmployee === member.id.toString()}
                    <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  {/if}
                </div>
                <div class="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span class="font-semibold">Current workload: {member.workload} tasks</span>
                </div>
              </button>
            {/each}
          </div>
        </div>

        <div>
          <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
            Assignment Notes (Optional)
          </label>
          <textarea
            bind:value={assignmentNotes}
            rows="3"
            placeholder="Add any instructions or notes for the employee..."
            class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-medium text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
          ></textarea>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-8">
        <button
          on:click={closeAssignModal}
          class="flex-1 px-6 py-3 lg:py-4 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all"
        >
          Cancel
        </button>
        <button
          on:click={assignTaskToEmployee}
          class="flex-1 px-6 py-3 lg:py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Assign Task
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Approval Modal -->
{#if showApprovalModal && selectedTaskForApproval}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade on:click={closeApprovalModal}>
    <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation transition:scale>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl lg:text-2xl font-black text-neutral-900 dark:text-white">Review Task Request</h3>
        <button
          on:click={closeApprovalModal}
          class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
        >
          <svg class="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 lg:p-6 mb-6 border-2 border-neutral-200 dark:border-neutral-700">
        <h4 class="text-lg lg:text-xl font-black text-neutral-900 dark:text-white mb-3">{selectedTaskForApproval.title}</h4>
        <p class="text-sm lg:text-base text-neutral-700 dark:text-neutral-300 mb-4">{selectedTaskForApproval.description}</p>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Employee:</p>
            <p class="font-bold text-neutral-900 dark:text-white">{selectedTaskForApproval.assignee.name}</p>
          </div>
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Estimated Time:</p>
            <p class="font-bold text-neutral-900 dark:text-white">{selectedTaskForApproval.estimatedTime}</p>
          </div>
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Deadline:</p>
            <p class="font-bold text-neutral-900 dark:text-white">{formatDate(selectedTaskForApproval.deadline)}</p>
          </div>
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-400">Priority:</p>
            <span class="px-2 py-1 rounded text-xs font-bold {getPriorityColor(selectedTaskForApproval.priority)}">{selectedTaskForApproval.priority.toUpperCase()}</span>
          </div>
        </div>

        {#if selectedTaskForApproval.employeeNotes}
          <div class="mt-4 p-3 bg-info-50 dark:bg-info-900/20 rounded-xl">
            <p class="text-sm font-semibold text-info-800 dark:text-info-300">
              <strong>Employee Notes:</strong> {selectedTaskForApproval.employeeNotes}
            </p>
          </div>
        {/if}
      </div>

      <div class="space-y-5">
        <div>
          <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
            Approved Time *
          </label>
          <input
            type="text"
            bind:value={adjustedTime}
            placeholder="e.g., 16 hours"
            class="w-full px-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-2">You can adjust the employee's estimated time</p>
        </div>

        <div>
          <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
            Notes (Optional)
          </label>
          <textarea
            bind:value={approvalNotes}
            rows="3"
            placeholder="Add any instructions or comments..."
            class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-medium text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
          ></textarea>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-8">
        <button
          on:click={rejectTask}
          class="flex-1 px-6 py-3 lg:py-4 bg-error-100 dark:bg-error-900/30 hover:bg-error-200 dark:hover:bg-error-900/50 text-error-700 dark:text-error-400 font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all"
        >
          Reject
        </button>
        <button
          on:click={approveTask}
          class="flex-1 px-6 py-3 lg:py-4 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Approve & Start Task
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Success Toast -->
{#if showSuccessToastFlag}
  <div class="fixed top-4 right-4 z-50" transition:fly={{ y: -20, duration: 300 }}>
    <div class="bg-success-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="font-bold">{successToastMessage}</span>
    </div>
  </div>
{/if}

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
