<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fly, fade, scale } from 'svelte/transition';
  
  let task = null;
  let loading = true;
  let activeTab = 'details';
  let showDeleteModal = false;
  let newComment = '';
  let newSubtask = '';
  
  // Mock data - Replace with actual API call
  const tasks = {
    1: {
      id: 1,
      title: 'Design Homepage UI',
      description: 'Create modern and responsive homepage design with hero section, features, and testimonials. Include mobile and tablet breakpoints.',
      fullDescription: 'Design a comprehensive homepage that showcases our product features, includes customer testimonials, and has a clear call-to-action. The design should be modern, clean, and follow our brand guidelines. Ensure all components are accessible and follow WCAG 2.1 AA standards.',
      status: 'in-progress',
      priority: 'urgent',
      project: { name: 'E-commerce Platform', icon: '🛒', id: 1 },
      assignee: { name: 'Sarah Smith', avatar: 'SS', email: 'sarah@example.com', role: 'UI/UX Designer' },
      reporter: { name: 'John Doe', avatar: 'JD', email: 'john@example.com' },
      dueDate: '2026-01-12',
      createdDate: '2026-01-08',
      updatedDate: '2026-01-10',
      tags: ['Design', 'UI/UX', 'Frontend', 'Responsive'],
      progress: 65,
      timeEstimate: '16 hours',
      timeSpent: '10.5 hours',
      subtasks: [
        { id: 1, title: 'Create wireframes', completed: true },
        { id: 2, title: 'Design hero section', completed: true },
        { id: 3, title: 'Design features section', completed: true },
        { id: 4, title: 'Design testimonials', completed: false },
        { id: 5, title: 'Mobile responsive design', completed: false }
      ],
      comments: [
        {
          id: 1,
          user: { name: 'John Doe', avatar: 'JD' },
          comment: 'Great progress! The hero section looks amazing. Can we add more contrast to the CTA button?',
          timestamp: '2026-01-10 10:30 AM',
          replies: [
            {
              id: 2,
              user: { name: 'Sarah Smith', avatar: 'SS' },
              comment: 'Thanks! Yes, I will increase the contrast. Good catch!',
              timestamp: '2026-01-10 11:15 AM'
            }
          ]
        },
        {
          id: 3,
          user: { name: 'Mike Johnson', avatar: 'MJ' },
          comment: 'Please ensure the design is compatible with our component library.',
          timestamp: '2026-01-09 03:45 PM',
          replies: []
        },
        {
          id: 4,
          user: { name: 'Emma Wilson', avatar: 'EW' },
          comment: 'Looking forward to testing this! Will it be ready by tomorrow?',
          timestamp: '2026-01-08 02:20 PM',
          replies: []
        }
      ],
      attachments: [
        { id: 1, name: 'Homepage-Mockup-v1.fig', size: '4.2 MB', type: 'figma', uploadedBy: 'Sarah Smith', date: '2026-01-08' },
        { id: 2, name: 'Design-Guidelines.pdf', size: '1.8 MB', type: 'pdf', uploadedBy: 'John Doe', date: '2026-01-08' },
        { id: 3, name: 'Hero-Section-Final.png', size: '856 KB', type: 'image', uploadedBy: 'Sarah Smith', date: '2026-01-10' }
      ],
      watchers: [
        { name: 'John Doe', avatar: 'JD' },
        { name: 'Mike Johnson', avatar: 'MJ' },
        { name: 'Emma Wilson', avatar: 'EW' }
      ],
      activity: [
        { type: 'status', user: 'Sarah Smith', action: 'changed status to In Progress', timestamp: '2026-01-10 09:00 AM' },
        { type: 'comment', user: 'John Doe', action: 'added a comment', timestamp: '2026-01-10 10:30 AM' },
        { type: 'progress', user: 'Sarah Smith', action: 'updated progress to 65%', timestamp: '2026-01-10 02:15 PM' },
        { type: 'subtask', user: 'Sarah Smith', action: 'completed subtask "Design features section"', timestamp: '2026-01-10 01:30 PM' },
        { type: 'attachment', user: 'Sarah Smith', action: 'uploaded Hero-Section-Final.png', timestamp: '2026-01-10 11:45 AM' }
      ],
      dependencies: [
        { id: 4, title: 'User Authentication System', status: 'completed', type: 'blocked-by' },
        { id: 5, title: 'Product Catalog Setup', status: 'completed', type: 'blocked-by' }
      ],
      relatedTasks: [
        { id: 6, title: 'Implement Homepage Components', status: 'pending', assignee: 'Mike Johnson' },
        { id: 7, title: 'Homepage Content Writing', status: 'in-progress', assignee: 'Lisa Chen' }
      ]
    },
    2: {
      id: 2,
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe payment gateway with order processing and invoice generation',
      fullDescription: 'Implement complete payment processing system using Stripe API. Include support for multiple payment methods, recurring payments, and automatic invoice generation.',
      status: 'pending',
      priority: 'urgent',
      project: { name: 'E-commerce Platform', icon: '🛒', id: 1 },
      assignee: { name: 'John Doe', avatar: 'JD', email: 'john@example.com', role: 'Backend Developer' },
      reporter: { name: 'Sarah Smith', avatar: 'SS', email: 'sarah@example.com' },
      dueDate: '2026-01-11',
      createdDate: '2026-01-07',
      updatedDate: '2026-01-09',
      tags: ['Backend', 'Payment', 'API', 'Integration'],
      progress: 0,
      timeEstimate: '24 hours',
      timeSpent: '0 hours',
      subtasks: [
        { id: 1, title: 'Setup Stripe account', completed: false },
        { id: 2, title: 'Implement payment API', completed: false },
        { id: 3, title: 'Add webhook handlers', completed: false },
        { id: 4, title: 'Create invoice system', completed: false },
        { id: 5, title: 'Add payment testing', completed: false },
        { id: 6, title: 'Security audit', completed: false },
        { id: 7, title: 'Documentation', completed: false },
        { id: 8, title: 'Production deployment', completed: false }
      ],
      comments: [
        {
          id: 1,
          user: { name: 'Sarah Smith', avatar: 'SS' },
          comment: 'This is critical for our launch. Please prioritize.',
          timestamp: '2026-01-09 09:00 AM',
          replies: []
        }
      ],
      attachments: [
        { id: 1, name: 'Stripe-API-Documentation.pdf', size: '2.1 MB', type: 'pdf', uploadedBy: 'John Doe', date: '2026-01-07' }
      ],
      watchers: [
        { name: 'Sarah Smith', avatar: 'SS' },
        { name: 'Alex Brown', avatar: 'AB' }
      ],
      activity: [
        { type: 'create', user: 'Sarah Smith', action: 'created this task', timestamp: '2026-01-07 10:00 AM' },
        { type: 'priority', user: 'Sarah Smith', action: 'set priority to Urgent', timestamp: '2026-01-09 09:00 AM' }
      ],
      dependencies: [],
      relatedTasks: []
    }
  };

  onMount(async () => {
    await loadTask();
  });

  async function loadTask() {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const taskId = parseInt($page.params.id);
      task = tasks[taskId] || null;
      
      if (!task) {
        goto('/admin/tasks');
      }
      
      loading = false;
    } catch (error) {
      console.error('Error loading task:', error);
      loading = false;
      goto('/admin/tasks');
    }
  }

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

  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  function toggleSubtask(subtaskId) {
    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
      const completedCount = task.subtasks.filter(st => st.completed).length;
      task.progress = Math.round((completedCount / task.subtasks.length) * 100);
      task = { ...task };
    }
  }

  function addComment() {
    if (newComment.trim()) {
      task.comments.push({
        id: task.comments.length + 1,
        user: { name: 'You', avatar: 'Y' },
        comment: newComment,
        timestamp: new Date().toLocaleString('en-IN'),
        replies: []
      });
      task = { ...task };
      newComment = '';
    }
  }

  function addSubtask() {
    if (newSubtask.trim()) {
      task.subtasks.push({
        id: task.subtasks.length + 1,
        title: newSubtask,
        completed: false
      });
      task = { ...task };
      newSubtask = '';
    }
  }

  function editTask() {
    goto(`/admin/tasks/${task.id}/edit`);
  }

  function deleteTask() {
    showDeleteModal = true;
  }

  function confirmDelete() {
    showDeleteModal = false;
    goto('/admin/tasks');
  }

  function updateStatus(newStatus) {
    task.status = newStatus;
    task = { ...task };
  }

  function updatePriority(newPriority) {
    task.priority = newPriority;
    task = { ...task };
  }

  function downloadAttachment(attachment) {
    console.log('Downloading:', attachment.name);
  }
</script>

<svelte:head>
  <title>{task ? task.title : 'Task'} - Task Manager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  {#if loading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 font-bold text-lg">Loading task...</p>
      </div>
    </div>
  {:else if task}
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- Breadcrumb & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav class="flex items-center gap-2 text-sm flex-wrap">
          <button
            on:click={() => goto('/admin/tasks')}
            class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
          >
            Tasks
          </button>
          <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <button
            on:click={() => goto(`/admin/projects/${task.project.id}`)}
            class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
          >
            {task.project.name}
          </button>
          <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-neutral-900 dark:text-white font-bold">#{task.id}</span>
        </nav>
        
        <div class="flex items-center gap-2">
          <button
            on:click={editTask}
            class="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-neutral-700 dark:text-neutral-300 hover:border-primary-500 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit
          </button>
          <button
            on:click={deleteTask}
            class="px-4 py-2 bg-error-100 dark:bg-error-900/30 border-2 border-error-200 dark:border-error-800 rounded-xl font-bold text-error-700 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-900/50 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Task Header -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8">
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 space-y-4">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                {task.project.icon}
              </div>
              <div class="flex-1">
                <h1 class="text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white mb-2">{task.title}</h1>
                <p class="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                  {task.description}
                </p>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <div class="relative group">
                <button class="px-4 py-2 rounded-xl text-sm font-bold border-2 {getStatusColor(task.status)} cursor-pointer">
                  {task.status.replace('-', ' ').toUpperCase()}
                </button>
                <div class="absolute top-full left-0 mt-2 hidden group-hover:block">
                  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-2 space-y-1 min-w-[150px]">
                    <button on:click={() => updateStatus('pending')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">To Do</button>
                    <button on:click={() => updateStatus('in-progress')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">In Progress</button>
                    <button on:click={() => updateStatus('review')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">Review</button>
                    <button on:click={() => updateStatus('completed')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">Completed</button>
                  </div>
                </div>
              </div>
              
              <div class="relative group">
                <button class="px-4 py-2 rounded-xl text-sm font-bold {getPriorityColor(task.priority)} cursor-pointer">
                  {task.priority.toUpperCase()} PRIORITY
                </button>
                <div class="absolute top-full left-0 mt-2 hidden group-hover:block">
                  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-2 space-y-1 min-w-[150px]">
                    <button on:click={() => updatePriority('urgent')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">Urgent</button>
                    <button on:click={() => updatePriority('high')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">High</button>
                    <button on:click={() => updatePriority('medium')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">Medium</button>
                    <button on:click={() => updatePriority('low')} class="w-full px-3 py-2 text-left text-sm font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white">Low</button>
                  </div>
                </div>
              </div>

              {#each task.tags as tag}
                <span class="px-4 py-2 rounded-xl text-sm font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                  {tag}
                </span>
              {/each}
            </div>
          </div>

          <!-- Progress Circle -->
          <div class="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800">
            <div class="relative w-28 h-28">
              <svg class="transform -rotate-90 w-28 h-28">
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="currentColor"
                  stroke-width="10"
                  fill="transparent"
                  class="text-neutral-200 dark:text-neutral-700"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="currentColor"
                  stroke-width="10"
                  fill="transparent"
                  stroke-dasharray="314"
                  stroke-dashoffset="{314 - (314 * task.progress) / 100}"
                  class="text-primary-600 dark:text-primary-400 transition-all duration-1000"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-3xl font-black text-primary-700 dark:text-primary-400">{task.progress}%</span>
                <span class="text-xs font-semibold text-primary-600 dark:text-primary-500">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">📋</span>
              Description
            </h3>
            <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {task.fullDescription}
            </p>
          </div>

          <!-- Subtasks -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <span class="text-2xl">✅</span>
                Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
              </h3>
            </div>
            
            <div class="space-y-2 mb-4">
              {#each task.subtasks as subtask}
                <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    on:change={() => toggleSubtask(subtask.id)}
                    class="w-5 h-5 rounded border-2 border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  />
                  <span class="flex-1 text-sm font-semibold {subtask.completed ? 'line-through text-neutral-500 dark:text-neutral-500' : 'text-neutral-900 dark:text-white'}">
                    {subtask.title}
                  </span>
                </div>
              {/each}
            </div>

            <!-- Add Subtask -->
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={newSubtask}
                placeholder="Add new subtask..."
                class="flex-1 px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                on:keydown={(e) => e.key === 'Enter' && addSubtask()}
              />
              <button
                on:click={addSubtask}
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Comments -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">💬</span>
              Comments ({task.comments.length})
            </h3>
            
            <div class="space-y-4 mb-6">
              {#each task.comments as comment}
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">
                      {comment.user.avatar}
                    </div>
                    <div class="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-black text-neutral-900 dark:text-white">{comment.user.name}</span>
                        <span class="text-xs text-neutral-500 dark:text-neutral-500 font-medium">{comment.timestamp}</span>
                      </div>
                      <p class="text-sm text-neutral-700 dark:text-neutral-300">{comment.comment}</p>
                    </div>
                  </div>
                  {#if comment.replies.length > 0}
                    <div class="ml-12 space-y-3">
                      {#each comment.replies as reply}
                        <div class="flex items-start gap-3">
                          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
                            {reply.user.avatar}
                          </div>
                          <div class="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700">
                            <div class="flex items-center justify-between mb-1">
                              <span class="font-bold text-sm text-neutral-900 dark:text-white">{reply.user.name}</span>
                              <span class="text-xs text-neutral-500 dark:text-neutral-500 font-medium">{reply.timestamp}</span>
                            </div>
                            <p class="text-sm text-neutral-700 dark:text-neutral-300">{reply.comment}</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>

            <!-- Add Comment -->
            <div class="space-y-3">
              <textarea
                bind:value={newComment}
                placeholder="Add a comment..."
                rows="3"
                class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium resize-none"
              ></textarea>
              <button
                on:click={addComment}
                class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all"
              >
                Post Comment
              </button>
            </div>
          </div>

          <!-- Attachments -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <span class="text-2xl">📎</span>
                Attachments ({task.attachments.length})
              </h3>
              <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all text-sm">
                Upload File
              </button>
            </div>
            
            <div class="space-y-2">
              {#each task.attachments as attachment}
                <div class="flex items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all group cursor-pointer">
                  <div class="flex items-center gap-3 flex-1">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors text-sm">{attachment.name}</h4>
                      <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{attachment.size} • {attachment.uploadedBy} • {formatDate(attachment.date)}</p>
                    </div>
                  </div>
                  <button
                    on:click={() => downloadAttachment(attachment)}
                    class="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          </div>

          <!-- Activity Log -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">📝</span>
              Activity
            </h3>
            <div class="space-y-3">
              {#each task.activity as activity}
                <div class="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
                    {activity.user[0]}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-neutral-900 dark:text-white">
                      <span class="font-black">{activity.user}</span> {activity.action}
                    </p>
                    <p class="text-xs text-neutral-500 dark:text-neutral-500 font-medium mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Right Column - Sidebar -->
        <div class="space-y-6">
          <!-- Task Info -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4">Task Information</h3>
            <div class="space-y-4">
              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Project</p>
                <button
                  on:click={() => goto(`/admin/projects/${task.project.id}`)}
                  class="flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <span class="text-xl">{task.project.icon}</span>
                  {task.project.name}
                </button>
              </div>
              
              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Assignee</p>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {task.assignee.avatar}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-neutral-900 dark:text-white">{task.assignee.name}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-medium">{task.assignee.role}</p>
                  </div>
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Reporter</p>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {task.reporter.avatar}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-neutral-900 dark:text-white">{task.reporter.name}</p>
                  </div>
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Due Date</p>
                <p class="text-sm font-bold {isOverdue(task.dueDate, task.status) ? 'text-error-700 dark:text-error-400' : 'text-neutral-900 dark:text-white'}">
                  {formatDate(task.dueDate)}
                  {#if isOverdue(task.dueDate, task.status)}
                    <span class="text-xs">(Overdue)</span>
                  {:else if getDaysRemaining(task.dueDate) >= 0}
                    <span class="text-xs text-neutral-500">({getDaysRemaining(task.dueDate)} days left)</span>
                  {/if}
                </p>
              </div>

              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Time Tracking</p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{task.timeSpent} / {task.timeEstimate}</p>
                <div class="mt-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-info-500 to-info-600 h-2 rounded-full transition-all duration-500"
                    style="width: {(parseFloat(task.timeSpent) / parseFloat(task.timeEstimate)) * 100}%"
                  ></div>
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Created</p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{formatDate(task.createdDate)}</p>
              </div>

              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Last Updated</p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{formatDate(task.updatedDate)}</p>
              </div>
            </div>
          </div>

          <!-- Watchers -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-black text-neutral-900 dark:text-white">Watchers</h3>
              <button class="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline">
                Add
              </button>
            </div>
            <div class="space-y-2">
              {#each task.watchers as watcher}
                <div class="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {watcher.avatar}
                  </div>
                  <span class="text-sm font-bold text-neutral-900 dark:text-white">{watcher.name}</span>
                </div>
              {/each}
            </div>
          </div>

          <!-- Dependencies -->
          {#if task.dependencies.length > 0}
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4">Dependencies</h3>
              <div class="space-y-2">
                {#each task.dependencies as dep}
                  <button
                    on:click={() => goto(`/admin/tasks/${dep.id}`)}
                    class="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all text-left"
                  >
                    <p class="text-sm font-bold text-neutral-900 dark:text-white">#{dep.id} {dep.title}</p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold mt-1">{dep.type.replace('-', ' ').toUpperCase()}</p>
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Related Tasks -->
          {#if task.relatedTasks.length > 0}
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4">Related Tasks</h3>
              <div class="space-y-2">
                {#each task.relatedTasks as related}
                  <button
                    on:click={() => goto(`/admin/tasks/${related.id}`)}
                    class="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all text-left"
                  >
                    <p class="text-sm font-bold text-neutral-900 dark:text-white">#{related.id} {related.title}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="px-2 py-0.5 rounded text-xs font-bold {getStatusColor(related.status)}">
                        {related.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">👤 {related.assignee}</span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade>
    <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-full" in:scale={{ duration: 300 }}>
      <h3 class="text-2xl font-black text-neutral-900 dark:text-white mb-4">Delete Task?</h3>
      <p class="text-neutral-600 dark:text-neutral-400 mb-6">
        Are you sure you want to delete this task? This action cannot be undone.
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
