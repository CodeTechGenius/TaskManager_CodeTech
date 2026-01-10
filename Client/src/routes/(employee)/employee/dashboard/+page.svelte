<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade, scale } from 'svelte/transition';
  
  let loading = true;
  let greeting = '';
  let showRequestModal = false;
  let selectedRequest = null;
  let estimatedHours = '';
  let estimatedMinutes = '';
  let requestNotes = '';
  
  // Employee stats
  let stats = {
    myTasks: 8,
    completedToday: 3,
    pendingRequests: 3,
    hoursToday: 6.5,
    hoursWeek: 32,
    targetWeek: 40,
    activeProjects: 3,
    upcomingDeadlines: 4,
    productivity: 92,
    onTimeDelivery: 88
  };

  // Task Requests (Pending approval from employee)
  let taskRequests = [
    { 
      id: 1, 
      title: 'Implement OAuth 2.0 Authentication', 
      project: 'E-commerce Platform', 
      priority: 'urgent', 
      description: 'Integrate OAuth 2.0 authentication with Google and Facebook providers. Include token refresh mechanism and session management.',
      requestedBy: 'Sarah Johnson',
      requestedByRole: 'Project Manager',
      requestedDate: '2026-01-10',
      deadline: '2026-01-18',
      status: 'pending_employee'
    },
    { 
      id: 2, 
      title: 'Design User Dashboard Mockups', 
      project: 'CRM Dashboard', 
      priority: 'high', 
      description: 'Create high-fidelity mockups for the user dashboard including analytics widgets, charts, and navigation components.',
      requestedBy: 'Mike Brown',
      requestedByRole: 'Lead Designer',
      requestedDate: '2026-01-09',
      deadline: '2026-01-20',
      status: 'pending_employee'
    },
    { 
      id: 3, 
      title: 'API Performance Optimization', 
      project: 'Healthcare Portal', 
      priority: 'medium', 
      description: 'Optimize database queries and implement caching for frequently accessed endpoints. Target is to reduce response time by 40%.',
      requestedBy: 'David Wilson',
      requestedByRole: 'Tech Lead',
      requestedDate: '2026-01-08',
      deadline: '2026-01-22',
      status: 'pending_employee'
    }
  ];

  // Tasks pending admin approval
  let pendingAdminApproval = [
    { 
      id: 4, 
      title: 'Payment Gateway Integration', 
      project: 'E-commerce Platform', 
      priority: 'urgent',
      estimatedTime: '16 hours',
      submittedDate: '2026-01-09',
      status: 'pending_admin_approval'
    },
    { 
      id: 5, 
      title: 'Database Migration Script', 
      project: 'CRM Dashboard', 
      priority: 'high',
      estimatedTime: '12 hours',
      submittedDate: '2026-01-08',
      status: 'pending_admin_approval'
    }
  ];

  // Active tasks
  let activeTasks = [
    { 
      id: 6, 
      title: 'User Authentication Module', 
      project: 'Healthcare Portal', 
      priority: 'high', 
      status: 'in-progress', 
      progress: 75,
      approvedTime: '20 hours',
      timeSpent: '15 hours',
      dueDate: '2026-01-18'
    },
    { 
      id: 7, 
      title: 'API Documentation', 
      project: 'CRM Dashboard', 
      priority: 'medium', 
      status: 'in-progress', 
      progress: 45,
      approvedTime: '10 hours',
      timeSpent: '4.5 hours',
      dueDate: '2026-01-20'
    },
    { 
      id: 9, 
      title: 'Mobile App UI Components', 
      project: 'Mobile Banking App', 
      priority: 'high', 
      status: 'in-progress', 
      progress: 60,
      approvedTime: '18 hours',
      timeSpent: '10.8 hours',
      dueDate: '2026-01-16'
    }
  ];

  // Completed tasks
  let completedTasks = [
    { 
      id: 8, 
      title: 'Homepage UI Design', 
      project: 'E-commerce Platform', 
      priority: 'high',
      completedDate: '2026-01-09',
      timeSpent: '14 hours',
      approvedTime: '16 hours',
      status: 'completed'
    }
  ];

  // Recent activity
  let recentActivity = [
    { id: 1, type: 'completed', title: 'Completed task', task: 'Homepage UI Design', time: '2 hours ago', icon: 'success' },
    { id: 2, type: 'comment', title: 'Added comment', task: 'Payment Gateway Integration', time: '4 hours ago', icon: 'comment' },
    { id: 3, type: 'started', title: 'Started working', task: 'API Documentation', time: '6 hours ago', icon: 'play' },
    { id: 4, type: 'updated', title: 'Updated progress', task: 'User Authentication', time: '1 day ago', icon: 'update' }
  ];

  // Upcoming deadlines
  let upcomingDeadlines = [
    { id: 1, task: 'Mobile App UI Components', project: 'Mobile Banking', dueDate: '2026-01-16', daysLeft: 6, priority: 'high' },
    { id: 2, task: 'User Authentication Module', project: 'Healthcare Portal', dueDate: '2026-01-18', daysLeft: 8, priority: 'high' },
    { id: 3, task: 'API Documentation', project: 'CRM Dashboard', dueDate: '2026-01-20', daysLeft: 10, priority: 'medium' }
  ];

  onMount(async () => {
    setGreeting();
    await loadDashboard();
  });

  function setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else if (hour < 21) greeting = 'Good Evening';
    else greeting = 'Good Night';
  }

  async function loadDashboard() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      loading = false;
    } catch (error) {
      console.error('Error loading dashboard:', error);
      loading = false;
    }
  }

  function openRequestModal(request) {
    selectedRequest = request;
    estimatedHours = '';
    estimatedMinutes = '';
    requestNotes = '';
    showRequestModal = true;
  }

  function closeRequestModal() {
    showRequestModal = false;
    selectedRequest = null;
    estimatedHours = '';
    estimatedMinutes = '';
    requestNotes = '';
  }

  async function acceptRequest() {
    if (!estimatedHours && !estimatedMinutes) {
      alert('Please provide estimated time');
      return;
    }

    const totalHours = (parseInt(estimatedHours) || 0) + ((parseInt(estimatedMinutes) || 0) / 60);
    
    if (totalHours === 0) {
      alert('Estimated time must be greater than 0');
      return;
    }

    try {
      pendingAdminApproval = [...pendingAdminApproval, {
        ...selectedRequest,
        estimatedTime: `${estimatedHours || 0}h ${estimatedMinutes || 0}m`,
        notes: requestNotes,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'pending_admin_approval'
      }];

      taskRequests = taskRequests.filter(r => r.id !== selectedRequest.id);
      stats.pendingRequests = taskRequests.length;

      closeRequestModal();
      showSuccessToast('Task request accepted and sent for admin approval!');
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  }

  async function rejectRequest() {
    if (!confirm('Are you sure you want to reject this task request?')) return;

    try {
      taskRequests = taskRequests.filter(r => r.id !== selectedRequest.id);
      stats.pendingRequests = taskRequests.length;
      closeRequestModal();
      showSuccessToast('Task request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
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

  function getProgressColor(progress) {
    if (progress >= 80) return 'from-success-500 to-success-600';
    if (progress >= 50) return 'from-info-500 to-info-600';
    if (progress >= 25) return 'from-warning-500 to-warning-600';
    return 'from-error-500 to-error-600';
  }

  function getActivityIcon(type) {
    const icons = {
      completed: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
      comment: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>',
      started: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
      updated: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>'
    };
    return icons[type] || icons.updated;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatDateShort(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  }

  function viewTask(id) {
    goto(`/employee/tasks/${id}`);
  }

  function submitCompletedTask(taskId) {
    goto(`/employee/tasks/${taskId}/submit`);
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
  <title>Dashboard - Employee Portal</title>
</svelte:head>

<div class="min-h-screen">
  {#if loading}
    <div class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-16 sm:w-20 h-16 sm:h-20">
          <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 font-bold text-sm sm:text-lg">Loading dashboard...</p>
      </div>
    </div>
  {:else}
    <div class="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
      
      <!-- Welcome Header -->
      <div class="relative rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div class="relative p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 text-white">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2">{greeting}, John!</h1>
              <p class="text-sm sm:text-base lg:text-lg text-primary-100 font-semibold">Here's your work overview for today</p>
            </div>
            <div class="flex gap-3">
              <button class="px-4 lg:px-6 py-2.5 lg:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl lg:rounded-2xl border-2 border-white/30 text-sm lg:text-base font-bold transition-all flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Log Time
              </button>
              <button class="px-4 lg:px-6 py-2.5 lg:py-3 bg-white hover:bg-neutral-50 text-primary-700 rounded-xl lg:rounded-2xl shadow-xl text-sm lg:text-base font-bold transition-all flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                New Task
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20 hover:bg-white/15 transition-all">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <p class="text-2xl lg:text-3xl xl:text-4xl font-black">{stats.pendingRequests}</p>
              </div>
              <p class="text-xs lg:text-sm font-semibold text-white/80">New Requests</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20 hover:bg-white/15 transition-all">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <p class="text-2xl lg:text-3xl xl:text-4xl font-black">{activeTasks.length}</p>
              </div>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Active Tasks</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20 hover:bg-white/15 transition-all">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-2xl lg:text-3xl xl:text-4xl font-black">{stats.completedToday}</p>
              </div>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Done Today</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20 hover:bg-white/15 transition-all">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-2xl lg:text-3xl xl:text-4xl font-black">{stats.hoursWeek}</p>
              </div>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Hours/Week</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20 hover:bg-white/15 transition-all">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <p class="text-2xl lg:text-3xl xl:text-4xl font-black">{stats.productivity}%</p>
              </div>
              <p class="text-xs lg:text-sm font-semibold text-white/80">Productivity</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 xl:p-5 border border-white/20 hover:bg-white/15 transition-all">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-2xl lg:text-3xl xl:text-4xl font-black">{stats.onTimeDelivery}%</p>
              </div>
              <p class="text-xs lg:text-sm font-semibold text-white/80">On-Time</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        
        <!-- Left Column -->
        <div class="xl:col-span-8 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
          
          <!-- Task Requests Section -->
          {#if taskRequests.length > 0}
            <div class="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-warning-200 dark:border-warning-800 p-4 sm:p-5 md:p-6 lg:p-8">
              <div class="flex items-center justify-between mb-4 lg:mb-6">
                <div class="flex items-center gap-3 lg:gap-4">
                  <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-warning-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl lg:text-2xl font-black text-warning-900 dark:text-warning-100">New Task Requests</h3>
                    <p class="text-xs sm:text-sm lg:text-base text-warning-700 dark:text-warning-400 font-semibold">{taskRequests.length} pending request{taskRequests.length !== 1 ? 's' : ''} waiting for your response</p>
                  </div>
                </div>
                <span class="px-4 py-2 bg-warning-600 text-white rounded-xl font-black text-lg lg:text-xl">
                  {taskRequests.length}
                </span>
              </div>
              
              <div class="space-y-3 lg:space-y-4">
                {#each taskRequests as request}
                  <div class="bg-white dark:bg-neutral-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-neutral-200 dark:border-neutral-700 hover:border-warning-400 dark:hover:border-warning-600 transition-all">
                    <div class="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div class="flex-1 space-y-3">
                        <div class="flex flex-wrap items-start gap-2 lg:gap-3">
                          <h4 class="text-base lg:text-lg xl:text-xl font-black text-neutral-900 dark:text-white flex-1">{request.title}</h4>
                          <span class="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-bold border-2 {getPriorityColor(request.priority)} flex-shrink-0">
                            {request.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div class="flex items-center gap-2 text-sm lg:text-base font-semibold text-primary-600 dark:text-primary-400">
                          <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                          </svg>
                          {request.project}
                        </div>
                        
                        <p class="text-sm lg:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">{request.description}</p>
                        
                        <div class="flex flex-wrap gap-4 pt-2">
                          <div class="flex items-center gap-2 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <span class="font-semibold">{request.requestedBy}</span>
                            <span class="text-neutral-500">({request.requestedByRole})</span>
                          </div>
                          <div class="flex items-center gap-2 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span class="font-semibold">Deadline: {formatDate(request.deadline)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="flex lg:flex-col gap-2 lg:gap-3">
                        <button
                          on:click={() => openRequestModal(request)}
                          class="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 lg:py-3 bg-success-600 hover:bg-success-700 text-white font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          Accept & Estimate
                        </button>
                        <button
                          on:click={() => { selectedRequest = request; rejectRequest(); }}
                          class="px-4 lg:px-6 py-2.5 lg:py-3 bg-error-100 dark:bg-error-900/30 hover:bg-error-200 dark:hover:bg-error-900/50 text-error-700 dark:text-error-400 font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Pending Admin Approval -->
          {#if pendingAdminApproval.length > 0}
            <div class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-5 md:p-6 lg:p-8">
              <div class="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-info-100 dark:bg-info-900/30 flex items-center justify-center">
                  <svg class="w-5 h-5 lg:w-6 lg:h-6 text-info-600 dark:text-info-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 class="text-lg sm:text-xl lg:text-2xl font-black text-neutral-900 dark:text-white">Pending Admin Approval</h3>
              </div>
              
              <div class="grid gap-3 lg:gap-4">
                {#each pendingAdminApproval as task}
                  <div class="p-4 lg:p-5 rounded-xl lg:rounded-2xl bg-info-50 dark:bg-info-900/20 border-2 border-info-200 dark:border-info-800 hover:border-info-400 dark:hover:border-info-600 transition-all">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex-1 space-y-2">
                        <div class="flex flex-wrap items-center gap-2">
                          <h4 class="text-sm lg:text-base font-bold text-neutral-900 dark:text-white">{task.title}</h4>
                          <span class="px-2 py-1 rounded-lg text-xs font-bold border {getPriorityColor(task.priority)}">
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        <p class="text-xs lg:text-sm font-semibold text-primary-600 dark:text-primary-400">{task.project}</p>
                        <div class="flex flex-wrap gap-3 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                          <span class="font-bold">Estimated: {task.estimatedTime}</span>
                          <span class="font-semibold">Submitted: {formatDate(task.submittedDate)}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 bg-warning-100 dark:bg-warning-900/30 px-3 py-2 rounded-xl flex-shrink-0">
                        <svg class="w-4 h-4 lg:w-5 lg:h-5 text-warning-700 dark:text-warning-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span class="text-xs lg:text-sm font-bold text-warning-700 dark:text-warning-400">Waiting</span>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Active Tasks -->
          {#if activeTasks.length > 0}
            <div class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-5 md:p-6 lg:p-8">
              <div class="flex items-center justify-between mb-4 lg:mb-6">
                <div class="flex items-center gap-3 lg:gap-4">
                  <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 lg:w-6 lg:h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                  </div>
                  <h3 class="text-lg sm:text-xl lg:text-2xl font-black text-neutral-900 dark:text-white">Active Tasks</h3>
                </div>
                <a href="/employee/tasks" class="text-sm lg:text-base font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  View All →
                </a>
              </div>
              
              <div class="grid gap-3 lg:gap-4">
                {#each activeTasks as task}
                  <button
                    on:click={() => viewTask(task.id)}
                    class="w-full p-4 lg:p-5 rounded-xl lg:rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-600 transition-all text-left group"
                  >
                    <div class="space-y-3">
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 space-y-2">
                          <div class="flex flex-wrap items-center gap-2">
                            <h4 class="text-sm lg:text-base font-bold text-neutral-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{task.title}</h4>
                            <span class="px-2 py-1 rounded-lg text-xs font-bold border {getPriorityColor(task.priority)}">
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                          <p class="text-xs lg:text-sm font-semibold text-primary-600 dark:text-primary-400">{task.project}</p>
                          <div class="flex flex-wrap gap-3 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                            <span class="font-bold">Approved: {task.approvedTime}</span>
                            <span class="font-semibold">Spent: {task.timeSpent}</span>
                            <span class="font-semibold">Due: {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                        <div class="text-right flex-shrink-0">
                          <p class="text-2xl lg:text-3xl font-black text-primary-700 dark:text-primary-400">{task.progress}%</p>
                          <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Progress</p>
                        </div>
                      </div>
                      <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                        <div
                          class="bg-gradient-to-r {getProgressColor(task.progress)} h-3 rounded-full transition-all duration-500"
                          style="width: {task.progress}%"
                        ></div>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Completed Tasks -->
          {#if completedTasks.length > 0}
            <div class="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-success-200 dark:border-success-800 p-4 sm:p-5 md:p-6 lg:p-8">
              <div class="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-success-600 flex items-center justify-center">
                  <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl lg:text-2xl font-black text-success-900 dark:text-success-100">Completed Tasks</h3>
                  <p class="text-xs lg:text-sm text-success-700 dark:text-success-400 font-semibold">Ready to submit for review</p>
                </div>
              </div>
              
              <div class="space-y-3 lg:space-y-4">
                {#each completedTasks as task}
                  <div class="bg-white dark:bg-neutral-800 rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-lg border-2 border-neutral-200 dark:border-neutral-700">
                    <div class="space-y-3 lg:space-y-4">
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 space-y-2">
                          <div class="flex flex-wrap items-center gap-2">
                            <h4 class="text-base lg:text-lg font-bold text-neutral-900 dark:text-white">{task.title}</h4>
                            <span class="px-2 py-1 rounded-lg text-xs font-bold border {getPriorityColor(task.priority)}">
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                          <p class="text-sm lg:text-base font-semibold text-primary-600 dark:text-primary-400">{task.project}</p>
                          <div class="flex flex-wrap gap-3 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                            <span class="font-bold">Time Spent: {task.timeSpent}</span>
                            <span class="font-semibold">Approved: {task.approvedTime}</span>
                            <span class="font-semibold">Completed: {formatDate(task.completedDate)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        on:click={() => submitCompletedTask(task.id)}
                        class="w-full px-4 lg:px-6 py-2.5 lg:py-3 bg-success-600 hover:bg-success-700 text-white font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Submit for Review
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Right Sidebar -->
        <div class="xl:col-span-4 space-y-3 sm:space-y-4 md:space-y-6">
          
          <!-- Work Hours Card -->
          <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-primary-200 dark:border-primary-800 p-4 sm:p-5 lg:p-6">
            <div class="flex items-center gap-3 mb-4 lg:mb-6">
              <div class="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-base lg:text-lg font-black text-primary-900 dark:text-primary-100">Work Hours</h3>
            </div>
            <div class="text-center mb-4">
              <p class="text-5xl lg:text-6xl font-black text-primary-700 dark:text-primary-400 mb-2">{stats.hoursWeek}</p>
              <p class="text-sm lg:text-base font-semibold text-primary-600 dark:text-primary-500">of {stats.targetWeek} hours this week</p>
            </div>
            <div class="w-full bg-primary-200 dark:bg-primary-900/30 rounded-full h-3 lg:h-4">
              <div
                class="bg-gradient-to-r from-primary-600 to-secondary-600 h-3 lg:h-4 rounded-full transition-all duration-500"
                style="width: {(stats.hoursWeek / stats.targetWeek) * 100}%"
              ></div>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-4">
              <div class="text-center p-3 rounded-xl bg-white/50 dark:bg-white/5">
                <p class="text-2xl font-black text-primary-700 dark:text-primary-400">{stats.hoursToday}</p>
                <p class="text-xs font-semibold text-primary-600 dark:text-primary-500">Today</p>
              </div>
              <div class="text-center p-3 rounded-xl bg-white/50 dark:bg-white/5">
                <p class="text-2xl font-black text-primary-700 dark:text-primary-400">{stats.targetWeek - stats.hoursWeek}</p>
                <p class="text-xs font-semibold text-primary-600 dark:text-primary-500">Remaining</p>
              </div>
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-5 lg:p-6">
            <div class="flex items-center gap-3 mb-4 lg:mb-6">
              <div class="w-10 h-10 rounded-xl bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                <svg class="w-5 h-5 text-warning-700 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-base lg:text-lg font-black text-neutral-900 dark:text-white">Upcoming Deadlines</h3>
            </div>
            <div class="space-y-3">
              {#each upcomingDeadlines as deadline}
                <div class="p-3 lg:p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-warning-400 dark:hover:border-warning-600 transition-all">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <p class="text-sm lg:text-base font-bold text-neutral-900 dark:text-white flex-1">{deadline.task}</p>
                    <span class="px-2 py-1 rounded-lg text-[10px] lg:text-xs font-bold border {getPriorityColor(deadline.priority)}">
                      {deadline.priority.toUpperCase()}
                    </span>
                  </div>
                  <p class="text-xs lg:text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">{deadline.project}</p>
                  <div class="flex items-center justify-between text-xs lg:text-sm">
                    <span class="text-neutral-600 dark:text-neutral-400 font-medium">{formatDateShort(deadline.dueDate)}</span>
                    <span class="font-bold text-warning-700 dark:text-warning-400">{deadline.daysLeft} days left</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-5 lg:p-6">
            <div class="flex items-center gap-3 mb-4 lg:mb-6">
              <div class="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <svg class="w-5 h-5 text-secondary-700 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-base lg:text-lg font-black text-neutral-900 dark:text-white">Recent Activity</h3>
            </div>
            <div class="space-y-3">
              {#each recentActivity as activity}
                <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all">
                  <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {@html getActivityIcon(activity.type)}
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs lg:text-sm font-semibold text-neutral-900 dark:text-white">{activity.title}</p>
                    <p class="text-xs text-primary-600 dark:text-primary-400 font-medium truncate">{activity.task}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{activity.time}</p>
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

<!-- Request Modal (unchanged) -->
{#if showRequestModal && selectedRequest}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade on:click={closeRequestModal}>
    <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation transition:scale>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl lg:text-2xl font-black text-neutral-900 dark:text-white">Accept Task & Provide Estimate</h3>
        <button
          on:click={closeRequestModal}
          class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
        >
          <svg class="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Task Details -->
      <div class="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 lg:p-6 mb-6 border-2 border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center gap-2 mb-3">
          <h4 class="text-lg lg:text-xl font-black text-neutral-900 dark:text-white">{selectedRequest.title}</h4>
          <span class="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-bold border-2 {getPriorityColor(selectedRequest.priority)}">
            {selectedRequest.priority.toUpperCase()}
          </span>
        </div>
        <p class="text-sm lg:text-base font-semibold text-primary-600 dark:text-primary-400 mb-3">{selectedRequest.project}</p>
        <p class="text-sm lg:text-base text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">{selectedRequest.description}</p>
        <div class="flex flex-wrap gap-4 text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
          <span class="font-semibold">Requested by: {selectedRequest.requestedBy} ({selectedRequest.requestedByRole})</span>
          <span class="font-semibold">Deadline: {formatDate(selectedRequest.deadline)}</span>
        </div>
      </div>

      <!-- Time Estimate Form -->
      <div class="space-y-5">
        <div>
          <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
            Estimated Time Required *
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs lg:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Hours</label>
              <input
                type="number"
                bind:value={estimatedHours}
                min="0"
                max="999"
                placeholder="0"
                class="w-full px-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs lg:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Minutes</label>
              <select
                bind:value={estimatedMinutes}
                class="w-full px-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="">0</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
            Additional Notes (Optional)
          </label>
          <textarea
            bind:value={requestNotes}
            rows="4"
            placeholder="Add any notes about your time estimate or approach..."
            class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-medium text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
          ></textarea>
        </div>

        <div class="bg-info-50 dark:bg-info-900/20 border-2 border-info-200 dark:border-info-800 rounded-xl p-4 lg:p-5">
          <div class="flex gap-3">
            <svg class="w-5 h-5 lg:w-6 lg:h-6 text-info-700 dark:text-info-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="text-xs lg:text-sm text-info-700 dark:text-info-400 font-medium">
              <p class="font-bold mb-1">Note:</p>
              <p>Your time estimate will be sent to the admin for approval. Once approved, you can start working on this task.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-8">
        <button
          on:click={closeRequestModal}
          class="flex-1 px-6 py-3 lg:py-4 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
        >
          Cancel
        </button>
        <button
          on:click={acceptRequest}
          class="flex-1 px-6 py-3 lg:py-4 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white font-bold rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Accept & Send for Approval
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
