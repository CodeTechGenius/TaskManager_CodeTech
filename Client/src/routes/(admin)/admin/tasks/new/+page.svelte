<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade } from 'svelte/transition';
  
  // Form data
  let formData = {
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    estimatedTime: '',
    tags: [],
    watchers: [],
    subtasks: []
  };
  
  let newTag = '';
  let newSubtask = '';
  let errors = {};
  let submitting = false;
  let showSuccessModal = false;
  
  // Mock data - Replace with API calls
  let projects = [
    { id: 1, name: 'E-commerce Platform', icon: '🛒' },
    { id: 2, name: 'Mobile Banking App', icon: '📱' },
    { id: 3, name: 'CRM Dashboard', icon: '📊' },
    { id: 4, name: 'Healthcare Portal', icon: '🏥' },
    { id: 5, name: 'Real Estate Marketplace', icon: '🏠' },
    { id: 6, name: 'Learning Management System', icon: '📚' }
  ];
  
  let teamMembers = [
    { id: 1, name: 'John Doe', avatar: 'JD', role: 'Lead Developer', email: 'john@example.com' },
    { id: 2, name: 'Sarah Smith', avatar: 'SS', role: 'UI/UX Designer', email: 'sarah@example.com' },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', email: 'mike@example.com' },
    { id: 4, name: 'Emma Wilson', avatar: 'EW', role: 'QA Engineer', email: 'emma@example.com' },
    { id: 5, name: 'Alex Brown', avatar: 'AB', role: 'DevOps Engineer', email: 'alex@example.com' },
    { id: 6, name: 'Lisa Chen', avatar: 'LC', role: 'Full Stack Developer', email: 'lisa@example.com' },
    { id: 7, name: 'Tom Harris', avatar: 'TH', role: 'Frontend Developer', email: 'tom@example.com' }
  ];
  
  let commonTags = ['Frontend', 'Backend', 'Design', 'UI/UX', 'API', 'Testing', 'Bug', 'Feature', 'Documentation', 'Security', 'Performance', 'Database'];
  
  onMount(() => {
    // Set default due date to 7 days from now
    const date = new Date();
    date.setDate(date.getDate() + 7);
    formData.dueDate = date.toISOString().split('T')[0];
  });
  
  function getPriorityColor(priority) {
    const colors = {
      urgent: 'text-error-700 bg-error-100 dark:bg-error-900/30 dark:text-error-400 border-error-300 dark:border-error-700',
      high: 'text-warning-700 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400 border-warning-300 dark:border-warning-700',
      medium: 'text-info-700 bg-info-100 dark:bg-info-900/30 dark:text-info-400 border-info-300 dark:border-info-700',
      low: 'text-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600'
    };
    return colors[priority] || colors.medium;
  }
  
  function getStatusColor(status) {
    const colors = {
      pending: 'bg-error-100 text-error-700 border-error-300 dark:bg-error-900/30 dark:text-error-400 dark:border-error-700',
      'in-progress': 'bg-info-100 text-info-700 border-info-300 dark:bg-info-900/30 dark:text-info-400 dark:border-info-700',
      review: 'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-700',
      completed: 'bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400 dark:border-success-700'
    };
    return colors[status] || colors.pending;
  }
  
  function addTag() {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      formData.tags = [...formData.tags, newTag.trim()];
      newTag = '';
    }
  }
  
  function removeTag(tag) {
    formData.tags = formData.tags.filter(t => t !== tag);
  }
  
  function addCommonTag(tag) {
    if (!formData.tags.includes(tag)) {
      formData.tags = [...formData.tags, tag];
    }
  }
  
  function addSubtask() {
    if (newSubtask.trim()) {
      formData.subtasks = [...formData.subtasks, { id: Date.now(), title: newSubtask.trim(), completed: false }];
      newSubtask = '';
    }
  }
  
  function removeSubtask(id) {
    formData.subtasks = formData.subtasks.filter(st => st.id !== id);
  }
  
  function toggleWatcher(memberId) {
    if (formData.watchers.includes(memberId)) {
      formData.watchers = formData.watchers.filter(id => id !== memberId);
    } else {
      formData.watchers = [...formData.watchers, memberId];
    }
  }
  
  function validateForm() {
    errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.project) {
      errors.project = 'Project is required';
    }
    
    if (!formData.assignee) {
      errors.assignee = 'Assignee is required';
    }
    
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }
    
    submitting = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Creating task:', formData);
      
      // Show success modal
      showSuccessModal = true;
      
      // Redirect after 2 seconds
      setTimeout(() => {
        goto('/admin/tasks');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating task:', error);
      submitting = false;
    }
  }
  
  function cancel() {
    goto('/admin/tasks');
  }
</script>

<svelte:head>
  <title>Create New Task - Task Manager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
    
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm">
      <button
        on:click={() => goto('/admin/tasks')}
        class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
      >
        Tasks
      </button>
      <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      <span class="text-neutral-900 dark:text-white font-bold">Create New Task</span>
    </nav>

    <!-- Page Header -->
    <div class="relative rounded-3xl shadow-2xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div class="relative p-6 lg:p-10 text-white">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl">
            <span class="text-3xl lg:text-4xl">✨</span>
          </div>
          <div>
            <h1 class="text-3xl lg:text-4xl font-black tracking-tight">Create New Task</h1>
            <p class="text-primary-100 text-sm lg:text-base font-medium mt-1">
              Add a new task to your project
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      
      <!-- Basic Information -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8">
        <h2 class="text-2xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="text-2xl">📝</span>
          Basic Information
        </h2>
        
        <div class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
              Task Title <span class="text-error-600">*</span>
            </label>
            <input
              id="title"
              type="text"
              bind:value={formData.title}
              placeholder="Enter task title..."
              class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.title ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
            />
            {#if errors.title}
              <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{errors.title}</p>
            {/if}
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
              Description <span class="text-error-600">*</span>
            </label>
            <textarea
              id="description"
              bind:value={formData.description}
              placeholder="Describe the task in detail..."
              rows="5"
              class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.description ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium resize-none"
            ></textarea>
            {#if errors.description}
              <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{errors.description}</p>
            {/if}
          </div>

          <!-- Project & Assignee -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Project -->
            <div>
              <label for="project" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Project <span class="text-error-600">*</span>
              </label>
              <select
                id="project"
                bind:value={formData.project}
                class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.project ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              >
                <option value="">Select project...</option>
                {#each projects as project}
                  <option value={project.id}>{project.icon} {project.name}</option>
                {/each}
              </select>
              {#if errors.project}
                <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{errors.project}</p>
              {/if}
            </div>

            <!-- Assignee -->
            <div>
              <label for="assignee" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Assignee <span class="text-error-600">*</span>
              </label>
              <select
                id="assignee"
                bind:value={formData.assignee}
                class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.assignee ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              >
                <option value="">Select assignee...</option>
                {#each teamMembers as member}
                  <option value={member.id}>{member.name} - {member.role}</option>
                {/each}
              </select>
              {#if errors.assignee}
                <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{errors.assignee}</p>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Task Details -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8">
        <h2 class="text-2xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="text-2xl">⚙️</span>
          Task Details
        </h2>
        
        <div class="space-y-6">
          <!-- Priority & Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Priority -->
            <div>
              <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-3">
                Priority <span class="text-error-600">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3">
                {#each ['urgent', 'high', 'medium', 'low'] as priority}
                  <button
                    type="button"
                    on:click={() => formData.priority = priority}
                    class="px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all {
                      formData.priority === priority
                        ? getPriorityColor(priority) + ' ring-2 ring-offset-2 ring-primary-500 scale-105'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-600 hover:border-primary-500'
                    }"
                  >
                    {priority.toUpperCase()}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-3">
                Status <span class="text-error-600">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3">
                {#each [{id: 'pending', label: 'To Do'}, {id: 'in-progress', label: 'In Progress'}, {id: 'review', label: 'Review'}, {id: 'completed', label: 'Completed'}] as status}
                  <button
                    type="button"
                    on:click={() => formData.status = status.id}
                    class="px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all {
                      formData.status === status.id
                        ? getStatusColor(status.id) + ' ring-2 ring-offset-2 ring-primary-500 scale-105'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-600 hover:border-primary-500'
                    }"
                  >
                    {status.label}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Due Date & Estimated Time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Due Date -->
            <div>
              <label for="dueDate" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Due Date <span class="text-error-600">*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                bind:value={formData.dueDate}
                class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.dueDate ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              />
              {#if errors.dueDate}
                <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{errors.dueDate}</p>
              {/if}
            </div>

            <!-- Estimated Time -->
            <div>
              <label for="estimatedTime" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Estimated Time (hours)
              </label>
              <input
                id="estimatedTime"
                type="number"
                bind:value={formData.estimatedTime}
                placeholder="e.g. 8"
                min="0"
                step="0.5"
                class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8">
        <h2 class="text-2xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="text-2xl">🏷️</span>
          Tags
        </h2>
        
        <div class="space-y-4">
          <!-- Add Custom Tag -->
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={newTag}
              placeholder="Add custom tag..."
              class="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              on:click={addTag}
              class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all"
            >
              Add
            </button>
          </div>

          <!-- Common Tags -->
          <div>
            <p class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Quick Add:</p>
            <div class="flex flex-wrap gap-2">
              {#each commonTags as tag}
                <button
                  type="button"
                  on:click={() => addCommonTag(tag)}
                  class="px-3 py-1.5 rounded-lg text-sm font-semibold {
                    formData.tags.includes(tag)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-2 border-primary-300 dark:border-primary-700'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  } transition-all"
                >
                  {tag}
                </button>
              {/each}
            </div>
          </div>

          <!-- Selected Tags -->
          {#if formData.tags.length > 0}
            <div>
              <p class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Selected Tags:</p>
              <div class="flex flex-wrap gap-2">
                {#each formData.tags as tag}
                  <span class="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-bold flex items-center gap-2">
                    {tag}
                    <button
                      type="button"
                      on:click={() => removeTag(tag)}
                      class="hover:text-error-600 dark:hover:text-error-400 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Subtasks -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8">
        <h2 class="text-2xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="text-2xl">✅</span>
          Subtasks
        </h2>
        
        <div class="space-y-4">
          <!-- Add Subtask -->
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={newSubtask}
              placeholder="Add a subtask..."
              class="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
            />
            <button
              type="button"
              on:click={addSubtask}
              class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all"
            >
              Add
            </button>
          </div>

          <!-- Subtasks List -->
          {#if formData.subtasks.length > 0}
            <div class="space-y-2">
              {#each formData.subtasks as subtask (subtask.id)}
                <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span class="flex-1 text-sm font-semibold text-neutral-900 dark:text-white">{subtask.title}</span>
                  <button
                    type="button"
                    on:click={() => removeSubtask(subtask.id)}
                    class="p-1 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30 rounded-lg transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-8 text-neutral-400">
              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              <p class="text-sm font-semibold">No subtasks added yet</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Watchers -->
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8">
        <h2 class="text-2xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="text-2xl">👥</span>
          Watchers
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each teamMembers as member}
            <button
              type="button"
              on:click={() => toggleWatcher(member.id)}
              class="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all {
                formData.watchers.includes(member.id)
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-2 ring-primary-500/30'
                  : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-primary-500'
              }"
            >
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {member.avatar}
              </div>
              <div class="flex-1 text-left">
                <p class="text-sm font-bold text-neutral-900 dark:text-white">{member.name}</p>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{member.role}</p>
              </div>
              {#if formData.watchers.includes(member.id)}
                <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          on:click={cancel}
          class="flex-1 px-6 py-4 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all text-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          class="flex-1 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-2xl transition-all text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {#if submitting}
            <div class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating Task...
          {:else}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Create Task
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Success Modal -->
{#if showSuccessModal}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade>
    <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-8 max-w-md w-full text-center" in:fly={{ y: 20, duration: 300 }}>
      <div class="w-20 h-20 bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h3 class="text-2xl font-black text-neutral-900 dark:text-white mb-2">Task Created!</h3>
      <p class="text-neutral-600 dark:text-neutral-400 mb-6">
        Your task has been successfully created and assigned.
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-500 font-semibold">
        <div class="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        Redirecting to tasks...
      </div>
    </div>
  </div>
{/if}
