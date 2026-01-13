<script>
  import { goto } from '$app/navigation';
  import { fly, fade, scale, slide } from 'svelte/transition';
  
  // Form Data
  let taskData = {
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    assigneeId: '',
    deadline: '',
    estimatedTime: '',
    tags: [],
    subtasks: []
  };

  let newTag = '';
  let showTagInput = false;
  let newSubtask = '';
  let showSubtaskInput = false;
  let errors = {};
  let isSubmitting = false;
  let currentStep = 1;
  const totalSteps = 3;

  // Projects List
  const projects = [
    { id: 1, name: 'E-commerce Platform', color: 'from-blue-500 to-blue-600', description: 'Online shopping platform' },
    { id: 2, name: 'CRM Dashboard', color: 'from-purple-500 to-purple-600', description: 'Customer relationship management' },
    { id: 3, name: 'Healthcare Portal', color: 'from-green-500 to-green-600', description: 'Patient management system' },
    { id: 4, name: 'Mobile Banking App', color: 'from-orange-500 to-orange-600', description: 'Banking mobile application' },
    { id: 5, name: 'Real Estate Marketplace', color: 'from-red-500 to-red-600', description: 'Property listing platform' },
    { id: 6, name: 'Learning Management System', color: 'from-indigo-500 to-indigo-600', description: 'Online education platform' }
  ];

  // Team Members
  const teamMembers = [
    { id: 1, name: 'John Doe', avatar: 'JD', role: 'Lead Developer', skills: ['Backend', 'API', 'Database'], workload: 3, available: true },
    { id: 2, name: 'Sarah Smith', avatar: 'SS', role: 'UI/UX Designer', skills: ['Design', 'Frontend', 'UI/UX'], workload: 2, available: true },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Backend', 'Security', 'Testing'], workload: 4, available: true },
    { id: 4, name: 'Emma Wilson', avatar: 'EW', role: 'Full Stack Developer', skills: ['Frontend', 'Backend', 'Auth'], workload: 3, available: true },
    { id: 5, name: 'Alex Brown', avatar: 'AB', role: 'DevOps Engineer', skills: ['DevOps', 'Database', 'Performance'], workload: 2, available: true },
    { id: 6, name: 'Lisa Chen', avatar: 'LC', role: 'Frontend Developer', skills: ['Frontend', 'Mobile', 'Testing'], workload: 3, available: true },
    { id: 7, name: 'Tom Harris', avatar: 'TH', role: 'Backend Developer', skills: ['Backend', 'API', 'Documentation'], workload: 2, available: true }
  ];

  // Priority Options
  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600' },
    { id: 'medium', label: 'Medium', color: 'bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400 border-info-300 dark:border-info-600' },
    { id: 'high', label: 'High', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 border-warning-300 dark:border-warning-600' },
    { id: 'urgent', label: 'Urgent', color: 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 border-error-300 dark:border-error-600' }
  ];

  // Common Tags
  const commonTags = ['Frontend', 'Backend', 'UI/UX', 'Design', 'API', 'Database', 'Testing', 'Security', 'Mobile', 'Performance'];

  function validateStep(step) {
    errors = {};
    
    if (step === 1) {
      if (!taskData.title.trim()) {
        errors.title = 'Task title is required';
      }
      if (!taskData.description.trim()) {
        errors.description = 'Task description is required';
      }
      if (!taskData.projectId) {
        errors.projectId = 'Please select a project';
      }
    } else if (step === 2) {
      if (!taskData.assigneeId) {
        errors.assigneeId = 'Please assign the task to an employee';
      }
      if (!taskData.deadline) {
        errors.deadline = 'Deadline is required';
      }
      if (!taskData.estimatedTime) {
        errors.estimatedTime = 'Estimated time is required';
      }
    }
    
    return Object.keys(errors).length === 0;
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  // Tag Management
  function addTag() {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      taskData.tags = [...taskData.tags, newTag.trim()];
      newTag = '';
      showTagInput = false;
    }
  }

  function removeTag(tag) {
    taskData.tags = taskData.tags.filter(t => t !== tag);
  }

  function addCommonTag(tag) {
    if (!taskData.tags.includes(tag)) {
      taskData.tags = [...taskData.tags, tag];
    }
  }

  // Subtask Management
  function addSubtask() {
    if (newSubtask.trim()) {
      taskData.subtasks = [
        ...taskData.subtasks,
        {
          id: Date.now(),
          title: newSubtask.trim(),
          completed: false
        }
      ];
      newSubtask = '';
      showSubtaskInput = false;
    }
  }

  function removeSubtask(subtaskId) {
    taskData.subtasks = taskData.subtasks.filter(s => s.id !== subtaskId);
  }

  function toggleSubtask(subtaskId) {
    taskData.subtasks = taskData.subtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
  }

  function moveSubtaskUp(index) {
    if (index > 0) {
      const newSubtasks = [...taskData.subtasks];
      [newSubtasks[index - 1], newSubtasks[index]] = [newSubtasks[index], newSubtasks[index - 1]];
      taskData.subtasks = newSubtasks;
    }
  }

  function moveSubtaskDown(index) {
    if (index < taskData.subtasks.length - 1) {
      const newSubtasks = [...taskData.subtasks];
      [newSubtasks[index], newSubtasks[index + 1]] = [newSubtasks[index + 1], newSubtasks[index]];
      taskData.subtasks = newSubtasks;
    }
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;

    isSubmitting = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Task Created:', taskData);
      
      // Show success and redirect
      alert('Task created successfully with ' + taskData.subtasks.length + ' subtasks!');
      goto('/admin/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }

  function getSelectedProject() {
    return projects.find(p => p.id === taskData.projectId);
  }

  function getSelectedEmployee() {
    return teamMembers.find(m => m.id === taskData.assigneeId);
  }

  function getMinDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  function getSubtaskProgress() {
    if (taskData.subtasks.length === 0) return 0;
    const completed = taskData.subtasks.filter(s => s.completed).length;
    return Math.round((completed / taskData.subtasks.length) * 100);
  }
</script>

<svelte:head>
  <title>Create New Task - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  <div class="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 lg:space-y-8">
    
    <!-- Header -->
    <div class="relative rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div class="relative p-4 sm:p-5 md:p-6 lg:p-8 text-white">
        <div class="flex items-center gap-3 sm:gap-4 mb-4 lg:mb-6">
          <button
            on:click={() => goto('/admin/tasks')}
            class="p-2 sm:p-2.5 lg:p-3 rounded-xl lg:rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black">Create New Task</h1>
            <p class="text-sm sm:text-base text-white/80 font-semibold mt-1">Assign task with subtasks to your team</p>
          </div>
        </div>
        
        <!-- Progress Steps -->
        <div class="flex items-center justify-between max-w-2xl mx-auto">
          {#each Array(totalSteps) as _, i}
            <div class="flex items-center flex-1">
              <div class="flex flex-col items-center flex-1">
                <div class="relative">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-base sm:text-lg transition-all {
                    currentStep > i + 1 
                      ? 'bg-success-500 text-white' 
                      : currentStep === i + 1 
                        ? 'bg-white text-primary-700 ring-4 ring-white/30 scale-110' 
                        : 'bg-white/20 text-white/60'
                  }">
                    {#if currentStep > i + 1}
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    {:else}
                      {i + 1}
                    {/if}
                  </div>
                </div>
                <p class="text-xs sm:text-sm font-bold mt-2 text-center {currentStep === i + 1 ? 'text-white' : 'text-white/60'}">
                  {i === 0 ? 'Task Details' : i === 1 ? 'Assignment' : 'Review'}
                </p>
              </div>
              {#if i < totalSteps - 1}
                <div class="flex-1 h-1 mx-2 rounded-full transition-all {currentStep > i + 1 ? 'bg-success-500' : 'bg-white/20'}"></div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <form on:submit|preventDefault={handleSubmit}>
        
        <!-- Step 1: Task Details -->
        {#if currentStep === 1}
          <div class="p-4 sm:p-6 lg:p-8 space-y-6" in:fly={{ x: 100, duration: 300 }}>
            <div>
              <h2 class="text-xl lg:text-2xl font-black text-neutral-900 dark:text-white mb-1">Task Information</h2>
              <p class="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">Provide the basic details about the task</p>
            </div>

            <!-- Task Title -->
            <div>
              <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                Task Title *
              </label>
              <input
                type="text"
                bind:value={taskData.title}
                placeholder="e.g., Implement user authentication module"
                class="w-full px-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.title ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl lg:rounded-2xl text-neutral-900 dark:text-white font-semibold text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-neutral-400"
              />
              {#if errors.title}
                <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2" transition:fade>{errors.title}</p>
              {/if}
            </div>

            <!-- Task Description -->
            <div>
              <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                Task Description *
              </label>
              <textarea
                bind:value={taskData.description}
                rows="5"
                placeholder="Describe the task requirements, objectives, and any important details..."
                class="w-full px-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.description ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl lg:rounded-2xl text-neutral-900 dark:text-white font-medium text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none placeholder:text-neutral-400"
              ></textarea>
              {#if errors.description}
                <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2" transition:fade>{errors.description}</p>
              {/if}
            </div>

            <!-- Project Selection -->
            <div>
              <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                Select Project *
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {#each projects as project}
                  <button
                    type="button"
                    on:click={() => taskData.projectId = project.id}
                    class="p-4 lg:p-5 rounded-xl lg:rounded-2xl border-2 transition-all text-left group {
                      taskData.projectId === project.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-2 ring-primary-500/30 scale-105'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 hover:scale-102'
                    }"
                  >
                    <div class="flex items-start gap-3 mb-2">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br {project.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="text-base lg:text-lg font-black text-neutral-900 dark:text-white mb-1">{project.name}</h3>
                        <p class="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 font-semibold">{project.description}</p>
                      </div>
                      {#if taskData.projectId === project.id}
                        <svg class="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      {/if}
                    </div>
                  </button>
                {/each}
              </div>
              {#if errors.projectId}
                <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2" transition:fade>{errors.projectId}</p>
              {/if}
            </div>

            <!-- Priority Selection -->
            <div>
              <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                Task Priority
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {#each priorities as priority}
                  <button
                    type="button"
                    on:click={() => taskData.priority = priority.id}
                    class="p-4 rounded-xl border-2 transition-all font-bold text-sm lg:text-base {
                      taskData.priority === priority.id
                        ? priority.color + ' scale-105 ring-2'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:scale-102'
                    }"
                  >
                    {priority.label}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Subtasks Section -->
            <div>
              <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                Subtasks (Optional)
                <span class="text-xs font-normal text-neutral-600 dark:text-neutral-400 ml-2">Break down the task into smaller steps</span>
              </label>
              
              <div class="space-y-3">
                {#if taskData.subtasks.length > 0}
                  <div class="space-y-2">
                    {#each taskData.subtasks as subtask, index (subtask.id)}
                      <div class="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 group hover:border-primary-400 dark:hover:border-primary-600 transition-all" transition:slide>
                        <div class="flex items-center gap-2 flex-1">
                          <div class="flex flex-col gap-1">
                            <button
                              type="button"
                              on:click={() => moveSubtaskUp(index)}
                              disabled={index === 0}
                              class="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move up"
                            >
                              <svg class="w-3 h-3 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              on:click={() => moveSubtaskDown(index)}
                              disabled={index === taskData.subtasks.length - 1}
                              class="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move down"
                            >
                              <svg class="w-3 h-3 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                              </svg>
                            </button>
                          </div>
                          
                          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-500 w-6">{index + 1}.</span>
                          
                          <button
                            type="button"
                            on:click={() => toggleSubtask(subtask.id)}
                            class="w-5 h-5 rounded border-2 {subtask.completed ? 'bg-success-500 border-success-500' : 'border-neutral-300 dark:border-neutral-600'} flex items-center justify-center flex-shrink-0 transition-all"
                          >
                            {#if subtask.completed}
                              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                              </svg>
                            {/if}
                          </button>
                          
                          <span class="text-sm lg:text-base font-semibold text-neutral-900 dark:text-white flex-1 {subtask.completed ? 'line-through opacity-60' : ''}">
                            {subtask.title}
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          on:click={() => removeSubtask(subtask.id)}
                          class="p-2 hover:bg-error-100 dark:hover:bg-error-900/30 rounded-lg text-error-600 dark:text-error-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove subtask"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    {/each}
                  </div>
                {/if}

                {#if showSubtaskInput}
                  <div class="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border-2 border-primary-200 dark:border-primary-800" transition:slide>
                    <input
                      type="text"
                      bind:value={newSubtask}
                      placeholder="Enter subtask description..."
                      on:keydown={(e) => e.key === 'Enter' && addSubtask()}
                      class="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-400"
                      autofocus
                    />
                    <button
                      type="button"
                      on:click={addSubtask}
                      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-all text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      on:click={() => { showSubtaskInput = false; newSubtask = ''; }}
                      class="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg font-bold transition-all text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                {:else}
                  <button
                    type="button"
                    on:click={() => showSubtaskInput = true}
                    class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Subtask
                  </button>
                {/if}

                {#if taskData.subtasks.length > 0}
                  <div class="p-3 bg-info-50 dark:bg-info-900/20 rounded-xl border-2 border-info-200 dark:border-info-800">
                    <div class="flex items-center justify-between text-sm font-bold text-info-800 dark:text-info-300">
                      <span>{taskData.subtasks.length} Subtasks Added</span>
                      <span>{taskData.subtasks.filter(s => s.completed).length} Completed</span>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 2: Assignment Details -->
        {#if currentStep === 2}
          <div class="p-4 sm:p-6 lg:p-8 space-y-6" in:fly={{ x: 100, duration: 300 }}>
            <div>
              <h2 class="text-xl lg:text-2xl font-black text-neutral-900 dark:text-white mb-1">Assignment Details</h2>
              <p class="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">Choose the team member and set the timeline</p>
            </div>

            <!-- Employee Selection -->
            <div>
              <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                Assign To *
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {#each teamMembers as member}
                  <button
                    type="button"
                    on:click={() => taskData.assigneeId = member.id}
                    class="p-4 lg:p-5 rounded-xl lg:rounded-2xl border-2 transition-all text-left group {
                      taskData.assigneeId === member.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-2 ring-primary-500/30'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-primary-400'
                    }"
                  >
                    <div class="flex items-start gap-3 mb-3">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-lg font-black shadow-lg flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <h3 class="text-sm lg:text-base font-black text-neutral-900 dark:text-white">{member.name}</h3>
                            <p class="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 font-semibold">{member.role}</p>
                          </div>
                          {#if taskData.assigneeId === member.id}
                            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                            </svg>
                          {/if}
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-1.5 mb-3">
                      {#each member.skills.slice(0, 3) as skill}
                        <span class="px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs font-bold">
                          {skill}
                        </span>
                      {/each}
                    </div>

                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <span class="font-semibold">{member.workload} active tasks</span>
                      </div>
                      <span class="px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 rounded font-bold">
                        Available
                      </span>
                    </div>
                  </button>
                {/each}
              </div>
              {#if errors.assigneeId}
                <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2" transition:fade>{errors.assigneeId}</p>
              {/if}
            </div>

            <!-- Timeline -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                  Deadline *
                </label>
                <input
                  type="date"
                  bind:value={taskData.deadline}
                  min={getMinDate()}
                  class="w-full px-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.deadline ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl lg:rounded-2xl text-neutral-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                {#if errors.deadline}
                  <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2" transition:fade>{errors.deadline}</p>
                {/if}
              </div>

              <div>
                <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                  Estimated Time *
                </label>
                <input
                  type="text"
                  bind:value={taskData.estimatedTime}
                  placeholder="e.g., 16 hours"
                  class="w-full px-4 py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 {errors.estimatedTime ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl lg:rounded-2xl text-neutral-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-neutral-400"
                />
                {#if errors.estimatedTime}
                  <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2" transition:fade>{errors.estimatedTime}</p>
                {/if}
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm lg:text-base font-bold text-neutral-900 dark:text-white mb-3">
                Tags (Optional)
              </label>
              
              <div class="flex flex-wrap gap-2 mb-3">
                {#each taskData.tags as tag}
                  <span class="px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl text-sm font-bold flex items-center gap-2" transition:scale>
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
                
                {#if showTagInput}
                  <div class="flex items-center gap-2" transition:scale>
                    <input
                      type="text"
                      bind:value={newTag}
                      placeholder="Tag name"
                      on:keydown={(e) => e.key === 'Enter' && addTag()}
                      class="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      autofocus
                    />
                    <button
                      type="button"
                      on:click={addTag}
                      class="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      on:click={() => { showTagInput = false; newTag = ''; }}
                      class="px-3 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                {:else}
                  <button
                    type="button"
                    on:click={() => showTagInput = true}
                    class="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Tag
                  </button>
                {/if}
              </div>

              <div class="flex flex-wrap gap-2">
                <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold w-full mb-1">Quick add:</p>
                {#each commonTags as tag}
                  {#if !taskData.tags.includes(tag)}
                    <button
                      type="button"
                      on:click={() => addCommonTag(tag)}
                      class="px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-neutral-700 dark:text-neutral-300 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg text-xs font-semibold transition-all"
                    >
                      + {tag}
                    </button>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 3: Review -->
        {#if currentStep === 3}
          <div class="p-4 sm:p-6 lg:p-8 space-y-6" in:fly={{ x: 100, duration: 300 }}>
            <div>
              <h2 class="text-xl lg:text-2xl font-black text-neutral-900 dark:text-white mb-1">Review Task</h2>
              <p class="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">Review all details before creating the task</p>
            </div>

            <div class="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 lg:p-6 space-y-5 border-2 border-neutral-200 dark:border-neutral-700">
              <!-- Task Info -->
              <div>
                <h3 class="text-lg lg:text-xl font-black text-neutral-900 dark:text-white mb-3">{taskData.title}</h3>
                <p class="text-sm lg:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">{taskData.description}</p>
              </div>

              <div class="h-px bg-neutral-200 dark:bg-neutral-700"></div>

              <!-- Project & Priority -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">PROJECT</p>
                  {#if getSelectedProject()}
                    <div class="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-xl">
                      <div class="w-10 h-10 rounded-lg bg-gradient-to-br {getSelectedProject().color} flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-black text-neutral-900 dark:text-white">{getSelectedProject().name}</p>
                      </div>
                    </div>
                  {/if}
                </div>

                <div>
                  <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">PRIORITY</p>
                  <div class="p-3 rounded-xl {priorities.find(p => p.id === taskData.priority)?.color}">
                    <span class="text-sm font-black">{priorities.find(p => p.id === taskData.priority)?.label}</span>
                  </div>
                </div>
              </div>

              <div class="h-px bg-neutral-200 dark:bg-neutral-700"></div>

              <!-- Assignee -->
              <div>
                <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-3">ASSIGNED TO</p>
                {#if getSelectedEmployee()}
                  <div class="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl">
                    <div class="w-14 h-14 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-lg font-black shadow-lg">
                      {getSelectedEmployee().avatar}
                    </div>
                    <div class="flex-1">
                      <p class="text-base font-black text-neutral-900 dark:text-white">{getSelectedEmployee().name}</p>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">{getSelectedEmployee().role}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Current load</p>
                      <p class="text-lg font-black text-neutral-900 dark:text-white">{getSelectedEmployee().workload} tasks</p>
                    </div>
                  </div>
                {/if}
              </div>

              <div class="h-px bg-neutral-200 dark:bg-neutral-700"></div>

              <!-- Timeline -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">DEADLINE</p>
                  <div class="flex items-center gap-2 p-3 bg-white dark:bg-neutral-800 rounded-xl">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-sm font-bold text-neutral-900 dark:text-white">
                      {new Date(taskData.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div>
                  <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">ESTIMATED TIME</p>
                  <div class="flex items-center gap-2 p-3 bg-white dark:bg-neutral-800 rounded-xl">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-sm font-bold text-neutral-900 dark:text-white">{taskData.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <!-- Subtasks Summary -->
              {#if taskData.subtasks.length > 0}
                <div class="h-px bg-neutral-200 dark:bg-neutral-700"></div>
                
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400">SUBTASKS ({taskData.subtasks.length})</p>
                    <span class="text-xs font-bold text-primary-700 dark:text-primary-400">{getSubtaskProgress()}% Pre-completed</span>
                  </div>
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    {#each taskData.subtasks as subtask, index}
                      <div class="flex items-center gap-3 p-2 bg-white dark:bg-neutral-800 rounded-lg">
                        <span class="text-xs font-bold text-neutral-500 w-6">{index + 1}.</span>
                        <div class="w-4 h-4 rounded border-2 {subtask.completed ? 'bg-success-500 border-success-500' : 'border-neutral-300 dark:border-neutral-600'} flex items-center justify-center flex-shrink-0">
                          {#if subtask.completed}
                            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                            </svg>
                          {/if}
                        </div>
                        <span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex-1 {subtask.completed ? 'line-through opacity-60' : ''}">
                          {subtask.title}
                        </span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Tags -->
              {#if taskData.tags.length > 0}
                <div class="h-px bg-neutral-200 dark:bg-neutral-700"></div>
                
                <div>
                  <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">TAGS</p>
                  <div class="flex flex-wrap gap-2">
                    {#each taskData.tags as tag}
                      <span class="px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-bold">
                        {tag}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="p-4 sm:p-6 lg:p-8 bg-neutral-50 dark:bg-neutral-900 border-t-2 border-neutral-200 dark:border-neutral-700">
          <div class="flex flex-col sm:flex-row gap-3">
            {#if currentStep > 1}
              <button
                type="button"
                on:click={prevStep}
                class="flex-1 px-6 py-3 lg:py-4 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl lg:rounded-2xl text-base lg:text-lg transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Previous
              </button>
            {:else}
              <button
                type="button"
                on:click={() => goto('/admin/tasks')}
                class="flex-1 px-6 py-3 lg:py-4 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl lg:rounded-2xl text-base lg:text-lg transition-all"
              >
                Cancel
              </button>
            {/if}

            {#if currentStep < totalSteps}
              <button
                type="button"
                on:click={nextStep}
                class="flex-1 px-6 py-3 lg:py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl lg:rounded-2xl text-base lg:text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Next
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            {:else}
              <button
                type="submit"
                disabled={isSubmitting}
                class="flex-1 px-6 py-3 lg:py-4 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-bold rounded-xl lg:rounded-2xl text-base lg:text-lg transition-all shadow-xl hover:shadow-2xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {#if isSubmitting}
                  <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Creating...
                {:else}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Create Task
                {/if}
              </button>
            {/if}
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
