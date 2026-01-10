<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade, scale, slide } from 'svelte/transition';
  import { cubicOut, elasticOut } from 'svelte/easing';

  // Step management
  let currentStep = 1;
  const totalSteps = 6;
  
  // Form data
  let projectData = {
    // Step 1: Basic Info
    projectName: '',
    projectCode: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'planning',
    
    // Step 2: Timeline & Meetings
    kickoffDate: '',
    startDate: '',
    estimatedEndDate: '',
    actualEndDate: '',
    milestones: [],
    
    // Step 3: Tech Stack
    frontend: [],
    backend: [],
    database: [],
    deployment: [],
    otherTools: [],
    
    // Step 4: Team & Assignment
    projectManager: '',
    teamLead: '',
    assignedEmployees: [],
    
    // Step 5: Billing & Budget
    billingType: 'fixed',
    totalBudget: '',
    hourlyRate: '',
    currency: 'INR',
    paymentTerms: '',
    clientName: '',
    clientEmail: '',
    
    // Step 6: Server & Deployment
    productionServer: '',
    stagingServer: '',
    domain: '',
    hosting: '',
    cicd: '',
    monitoring: ''
  };

  // Options data
  const categories = ['Web Application', 'Mobile App', 'Desktop Software', 'E-commerce', 'CRM', 'ERP', 'Other'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];
  const statusOptions = ['planning', 'active', 'on-hold', 'completed'];
  
  const techStacks = {
    frontend: ['React', 'Vue.js', 'Angular', 'SvelteKit', 'Next.js', 'Nuxt.js', 'HTML/CSS/JS'],
    backend: ['Node.js', 'Python/Django', 'Python/Flask', 'Ruby on Rails', 'PHP/Laravel', 'Java/Spring', '.NET', 'Go'],
    database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Firebase'],
    deployment: ['AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Heroku', 'Vercel', 'Netlify', 'Custom Server'],
    tools: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Terraform', 'Ansible']
  };

  let employees = [
    { id: 1, name: 'John Doe', role: 'Full Stack Developer', avatar: 'JD', available: true },
    { id: 2, name: 'Sarah Smith', role: 'Frontend Developer', avatar: 'SS', available: true },
    { id: 3, name: 'Mike Johnson', role: 'Backend Developer', avatar: 'MJ', available: false },
    { id: 4, name: 'Emma Wilson', role: 'UI/UX Designer', avatar: 'EW', available: true },
    { id: 5, name: 'Alex Brown', role: 'DevOps Engineer', avatar: 'AB', available: true },
    { id: 6, name: 'Lisa Chen', role: 'QA Engineer', avatar: 'LC', available: true }
  ];

  let milestones = [];
  let newMilestone = { name: '', date: '', description: '' };

  // Validation
  let errors = {};
  let showErrors = false;
  let activeTab = 'new-project';

  const stepTitles = [
    'Basic Information',
    'Timeline & Dates',
    'Technology Stack',
    'Team Assignment',
    'Billing & Budget',
    'Server & Deployment'
  ];

  const stepIcons = [
    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01'
  ];

  // Step navigation functions
  function nextStep() {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        showErrors = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      showErrors = true;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      showErrors = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goToStep(step) {
    if (step <= currentStep || validateAllPreviousSteps(step)) {
      currentStep = step;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function validateStep(step) {
    errors = {};
    
    switch(step) {
      case 1:
        if (!projectData.projectName.trim()) errors.projectName = 'Project name is required';
        if (!projectData.projectCode.trim()) errors.projectCode = 'Project code is required';
        if (!projectData.category) errors.category = 'Category is required';
        break;
      case 2:
        if (!projectData.kickoffDate) errors.kickoffDate = 'Kickoff date is required';
        if (!projectData.startDate) errors.startDate = 'Start date is required';
        if (!projectData.estimatedEndDate) errors.estimatedEndDate = 'End date is required';
        break;
      case 3:
        if (projectData.frontend.length === 0) errors.frontend = 'Select at least one frontend technology';
        if (projectData.backend.length === 0) errors.backend = 'Select at least one backend technology';
        if (projectData.database.length === 0) errors.database = 'Select at least one database';
        break;
      case 4:
        if (!projectData.projectManager) errors.projectManager = 'Project manager is required';
        if (projectData.assignedEmployees.length === 0) errors.assignedEmployees = 'Assign at least one team member';
        break;
      case 5:
        if (!projectData.totalBudget) errors.totalBudget = 'Budget is required';
        if (!projectData.clientName.trim()) errors.clientName = 'Client name is required';
        break;
    }
    
    return Object.keys(errors).length === 0;
  }

  function validateAllPreviousSteps(targetStep) {
    for (let i = 1; i < targetStep; i++) {
      if (!validateStep(i)) return false;
    }
    return true;
  }

  function toggleTech(category, tech) {
    const index = projectData[category].indexOf(tech);
    if (index > -1) {
      projectData[category] = projectData[category].filter(t => t !== tech);
    } else {
      projectData[category] = [...projectData[category], tech];
    }
  }

  function toggleEmployee(employeeId) {
    const index = projectData.assignedEmployees.indexOf(employeeId);
    if (index > -1) {
      projectData.assignedEmployees = projectData.assignedEmployees.filter(id => id !== employeeId);
    } else {
      projectData.assignedEmployees = [...projectData.assignedEmployees, employeeId];
    }
  }

  function addMilestone() {
    if (newMilestone.name && newMilestone.date) {
      milestones = [...milestones, { ...newMilestone, id: Date.now() }];
      projectData.milestones = milestones;
      newMilestone = { name: '', date: '', description: '' };
    }
  }

  function removeMilestone(id) {
    milestones = milestones.filter(m => m.id !== id);
    projectData.milestones = milestones;
  }

  async function submitProject() {
    if (validateStep(currentStep)) {
      console.log('Project Data:', projectData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      goto('/admin/dashboard');
    } else {
      showErrors = true;
    }
  }

  function getPriorityColor(priority) {
    const colors = {
      low: 'bg-info-100 text-info-700 border-info-300',
      medium: 'bg-warning-100 text-warning-700 border-warning-300',
      high: 'bg-secondary-100 text-secondary-700 border-secondary-300',
      urgent: 'bg-error-100 text-error-700 border-error-300'
    };
    return colors[priority];
  }

  function navigateTo(path) {
    goto(`/admin/${path}`);
  }
</script>

<svelte:head>
  <title>Create New Project - TaskFlow</title>
</svelte:head>

<!-- Mobile Top Navbar -->
<nav class="lg:hidden sticky top-0 z-50 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 shadow-2xl">
  <div class="flex items-center justify-between px-4 py-4">
    <button
      on:click={() => goto('/admin/dashboard')}
      class="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
    >
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
      </svg>
    </button>
    
    <div class="flex-1 mx-4">
      <h1 class="text-lg font-black text-white text-center">Create Project</h1>
      <p class="text-xs text-primary-100 text-center font-semibold">Step {currentStep} of {totalSteps}</p>
    </div>
    
    <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
      <span class="text-white font-black">{Math.round((currentStep / totalSteps) * 100)}%</span>
    </div>
  </div>
  
  <!-- Mobile Progress Bar -->
  <div class="h-1.5 bg-primary-900/50">
    <div 
      class="h-full bg-gradient-to-r from-accent-400 to-accent-600 transition-all duration-500 rounded-r-full"
      style="width: {(currentStep / totalSteps) * 100}%"
    ></div>
  </div>
</nav>

<!-- Desktop Header -->
<div class="hidden lg:block bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-800">
  <div class="max-w-6xl mx-auto px-8 py-6">
    <button
      on:click={() => goto('/admin/dashboard')}
      class="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-4 transition-colors group"
    >
      <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
      </svg>
      Back to Dashboard
    </button>
    
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
          <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          Create New Project
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400 font-semibold">Complete all steps to create your project</p>
      </div>
      <div class="text-right">
        <div class="text-5xl font-black bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          {Math.round((currentStep / totalSteps) * 100)}%
        </div>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 font-bold">Progress</p>
      </div>
    </div>
  </div>
</div>

<!-- Main Container -->
<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-32 lg:pb-8">
  <div class="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
    
    <!-- Desktop Step Progress -->
    <div class="hidden lg:block bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-8 mb-8">
      <div class="relative">
        <!-- Progress Line -->
        <div class="absolute top-12 left-0 right-0 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
          <div 
            class="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-full transition-all duration-700"
            style="width: {((currentStep - 1) / (totalSteps - 1)) * 100}%"
          ></div>
        </div>

        <!-- Steps -->
        <div class="relative grid grid-cols-6 gap-2">
          {#each Array(totalSteps) as _, i}
            <button
              on:click={() => goToStep(i + 1)}
              class="flex flex-col items-center gap-3 transition-all"
              disabled={i + 1 > currentStep}
            >
              <div class="relative z-10">
                <div class="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-xl {
                  i + 1 === currentStep 
                    ? 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white scale-110 animate-pulse' 
                    : i + 1 < currentStep 
                    ? 'bg-success-500 text-white' 
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400'
                }">
                  {#if i + 1 < currentStep}
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  {:else}
                    <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={stepIcons[i]}/>
                    </svg>
                  {/if}
                </div>
              </div>
              <div class="text-center">
                <p class="text-xs font-bold {i + 1 === currentStep ? 'text-primary-600' : 'text-neutral-600 dark:text-neutral-400'}">
                  {stepTitles[i]}
                </p>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Mobile Step Indicator -->
    <div class="lg:hidden mb-6">
      <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={stepIcons[currentStep - 1]}/>
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-black text-neutral-900 dark:text-white">{stepTitles[currentStep - 1]}</h2>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>
        
        <!-- Mini Step Dots -->
        <div class="flex gap-2 justify-center">
          {#each Array(totalSteps) as _, i}
            <button
              on:click={() => goToStep(i + 1)}
              class="transition-all {
                i + 1 === currentStep 
                  ? 'w-8 h-2 bg-gradient-to-r from-primary-500 to-primary-600' 
                  : i + 1 < currentStep
                  ? 'w-2 h-2 bg-success-500'
                  : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-600'
              } rounded-full"
            ></button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div class="p-4 sm:p-6 lg:p-10">
        
        <!-- Step 1: Basic Information -->
        {#if currentStep === 1}
          <div in:fly={{ x: 20, duration: 400, easing: cubicOut }}>
            <div class="space-y-5">
              <!-- Project Name -->
              <div>
                <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-error-500 rounded-full"></span>
                  Project Name
                </label>
                <input
                  type="text"
                  bind:value={projectData.projectName}
                  placeholder="e.g., E-commerce Platform Redesign"
                  class="w-full px-4 py-4 rounded-xl border-2 {showErrors && errors.projectName ? 'border-error-500 shake' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all font-semibold text-base"
                />
                {#if showErrors && errors.projectName}
                  <p class="mt-2 text-sm text-error-600 dark:text-error-400 font-semibold flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {errors.projectName}
                  </p>
                {/if}
              </div>

              <!-- Project Code & Category -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-error-500 rounded-full"></span>
                    Project Code
                  </label>
                  <input
                    type="text"
                    bind:value={projectData.projectCode}
                    placeholder="PROJ-2026-001"
                    class="w-full px-4 py-4 rounded-xl border-2 {showErrors && errors.projectCode ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-bold uppercase text-base"
                  />
                  {#if showErrors && errors.projectCode}
                    <p class="mt-2 text-sm text-error-600 font-semibold">{errors.projectCode}</p>
                  {/if}
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-error-500 rounded-full"></span>
                    Category
                  </label>
                  <select
                    bind:value={projectData.category}
                    class="w-full px-4 py-4 rounded-xl border-2 {showErrors && errors.category ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-semibold text-base"
                  >
                    <option value="">Select Category</option>
                    {#each categories as cat}
                      <option value={cat}>{cat}</option>
                    {/each}
                  </select>
                  {#if showErrors && errors.category}
                    <p class="mt-2 text-sm text-error-600 font-semibold">{errors.category}</p>
                  {/if}
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                  Project Description
                </label>
                <textarea
                  bind:value={projectData.description}
                  placeholder="Describe the project objectives, scope, and key deliverables..."
                  rows="4"
                  class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-medium resize-none text-base"
                ></textarea>
              </div>

              <!-- Priority -->
              <div>
                <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
                  Priority Level
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {#each priorityOptions as priority}
                    <button
                      type="button"
                      on:click={() => projectData.priority = priority}
                      class="px-5 py-4 rounded-xl border-2 font-bold text-base capitalize transition-all {
                        projectData.priority === priority
                          ? getPriorityColor(priority) + ' shadow-lg scale-105'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 active:scale-95'
                      }"
                    >
                      {priority}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
                  Initial Status
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {#each statusOptions as status}
                    <button
                      type="button"
                      on:click={() => projectData.status = status}
                      class="px-5 py-4 rounded-xl border-2 font-bold text-base capitalize transition-all {
                        projectData.status === status
                          ? 'bg-accent-100 text-accent-700 border-accent-500 shadow-lg scale-105'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 active:scale-95'
                      }"
                    >
                      {status}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 2: Timeline -->
        {#if currentStep === 2}
          <div in:fly={{ x: 20, duration: 400, easing: cubicOut }}>
            <div class="space-y-5">
              <!-- Dates -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Kickoff Meeting
                  </label>
                  <input
                    type="date"
                    bind:value={projectData.kickoffDate}
                    class="w-full px-4 py-4 rounded-xl border-2 {showErrors && errors.kickoffDate ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-semibold text-base"
                  />
                  {#if showErrors && errors.kickoffDate}
                    <p class="mt-2 text-sm text-error-600 font-semibold">{errors.kickoffDate}</p>
                  {/if}
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Project Start Date
                  </label>
                  <input
                    type="date"
                    bind:value={projectData.startDate}
                    class="w-full px-4 py-4 rounded-xl border-2 {showErrors && errors.startDate ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-success-500 focus:ring-4 focus:ring-success-100 transition-all font-semibold text-base"
                  />
                  {#if showErrors && errors.startDate}
                    <p class="mt-2 text-sm text-error-600 font-semibold">{errors.startDate}</p>
                  {/if}
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Estimated End Date
                  </label>
                  <input
                    type="date"
                    bind:value={projectData.estimatedEndDate}
                    class="w-full px-4 py-4 rounded-xl border-2 {showErrors && errors.estimatedEndDate ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-warning-500 focus:ring-4 focus:ring-warning-100 transition-all font-semibold text-base"
                  />
                  {#if showErrors && errors.estimatedEndDate}
                    <p class="mt-2 text-sm text-error-600 font-semibold">{errors.estimatedEndDate}</p>
                  {/if}
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Actual End Date (Optional)
                  </label>
                  <input
                    type="date"
                    bind:value={projectData.actualEndDate}
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-info-500 focus:ring-4 focus:ring-info-100 transition-all font-semibold text-base"
                  />
                </div>
              </div>

              <!-- Milestones -->
              <div class="mt-6">
                <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  Milestones (Optional)
                </h3>

                <div class="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border-2 border-neutral-200 dark:border-neutral-700 mb-4">
                  <div class="space-y-3">
                    <input
                      type="text"
                      bind:value={newMilestone.name}
                      placeholder="Milestone name"
                      class="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all font-semibold"
                    />
                    <input
                      type="date"
                      bind:value={newMilestone.date}
                      class="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all font-semibold"
                    />
                    <input
                      type="text"
                      bind:value={newMilestone.description}
                      placeholder="Description (optional)"
                      class="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all font-medium"
                    />
                    <button
                      type="button"
                      on:click={addMilestone}
                      class="w-full px-5 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Add Milestone
                    </button>
                  </div>
                </div>

                {#if milestones.length > 0}
                  <div class="space-y-2">
                    {#each milestones as milestone (milestone.id)}
                      <div class="bg-white dark:bg-neutral-900 rounded-xl p-4 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <div class="w-2 h-2 bg-accent-500 rounded-full"></div>
                            <h4 class="font-bold text-neutral-900 dark:text-white">{milestone.name}</h4>
                          </div>
                          <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            {milestone.date}
                          </div>
                          {#if milestone.description}
                            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{milestone.description}</p>
                          {/if}
                        </div>
                        <button
                          type="button"
                          on:click={() => removeMilestone(milestone.id)}
                          class="p-2 text-error-600 hover:bg-error-100 dark:hover:bg-error-900/30 rounded-lg transition-all"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 3: Tech Stack -->
        {#if currentStep === 3}
          <div in:fly={{ x: 20, duration: 400, easing: cubicOut }}>
            <div class="space-y-6">
              <!-- Frontend -->
              <div>
                <label class="block text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  Frontend Technologies
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {#each techStacks.frontend as tech}
                    <button
                      type="button"
                      on:click={() => toggleTech('frontend', tech)}
                      class="px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 {
                        projectData.frontend.includes(tech)
                          ? 'bg-primary-500 text-white border-primary-600 shadow-lg'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-primary-400'
                      }"
                    >
                      {tech}
                    </button>
                  {/each}
                </div>
                {#if showErrors && errors.frontend}
                  <p class="mt-2 text-sm text-error-600 font-semibold">{errors.frontend}</p>
                {/if}
              </div>

              <!-- Backend -->
              <div>
                <label class="block text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <div class="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/>
                    </svg>
                  </div>
                  Backend Technologies
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {#each techStacks.backend as tech}
                    <button
                      type="button"
                      on:click={() => toggleTech('backend', tech)}
                      class="px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 {
                        projectData.backend.includes(tech)
                          ? 'bg-secondary-500 text-white border-secondary-600 shadow-lg'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-secondary-400'
                      }"
                    >
                      {tech}
                    </button>
                  {/each}
                </div>
                {#if showErrors && errors.backend}
                  <p class="mt-2 text-sm text-error-600 font-semibold">{errors.backend}</p>
                {/if}
              </div>

              <!-- Database -->
              <div>
                <label class="block text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <div class="w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                    </svg>
                  </div>
                  Database
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {#each techStacks.database as tech}
                    <button
                      type="button"
                      on:click={() => toggleTech('database', tech)}
                      class="px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 {
                        projectData.database.includes(tech)
                          ? 'bg-accent-500 text-white border-accent-600 shadow-lg'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-accent-400'
                      }"
                    >
                      {tech}
                    </button>
                  {/each}
                </div>
                {#if showErrors && errors.database}
                  <p class="mt-2 text-sm text-error-600 font-semibold">{errors.database}</p>
                {/if}
              </div>

              <!-- Deployment -->
              <div>
                <label class="block text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <div class="w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                    </svg>
                  </div>
                  Deployment Platform
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {#each techStacks.deployment as tech}
                    <button
                      type="button"
                      on:click={() => toggleTech('deployment', tech)}
                      class="px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 {
                        projectData.deployment.includes(tech)
                          ? 'bg-success-500 text-white border-success-600 shadow-lg'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-success-400'
                      }"
                    >
                      {tech}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- DevOps Tools -->
              <div>
                <label class="block text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <div class="w-8 h-8 bg-info-100 dark:bg-info-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    </svg>
                  </div>
                  DevOps & Tools
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {#each techStacks.tools as tech}
                    <button
                      type="button"
                      on:click={() => toggleTech('otherTools', tech)}
                      class="px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 {
                        projectData.otherTools.includes(tech)
                          ? 'bg-info-500 text-white border-info-600 shadow-lg'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-info-400'
                      }"
                    >
                      {tech}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 4: Team Assignment -->
        {#if currentStep === 4}
          <div in:fly={{ x: 20, duration: 400, easing: cubicOut }}>
            <div class="space-y-5">
              <!-- Project Manager & Team Lead -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-error-500 rounded-full"></span>
                    Project Manager
                  </label>
                  <select
                    bind:value={projectData.projectManager}
                    class="w-full px-4 py-4 rounded-xl border-2 {showErrors && errors.projectManager ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-semibold text-base"
                  >
                    <option value="">Select Manager</option>
                    {#each employees as emp}
                      <option value={emp.id}>{emp.name}</option>
                    {/each}
                  </select>
                  {#if showErrors && errors.projectManager}
                    <p class="mt-2 text-sm text-error-600 font-semibold">{errors.projectManager}</p>
                  {/if}
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    Team Lead
                  </label>
                  <select
                    bind:value={projectData.teamLead}
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-semibold text-base"
                  >
                    <option value="">Select Lead</option>
                    {#each employees as emp}
                      <option value={emp.id}>{emp.name}</option>
                    {/each}
                  </select>
                </div>
              </div>

              <!-- Team Members -->
              <div>
                <label class="block text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  Assign Team Members
                </label>
                
                <div class="grid grid-cols-1 gap-3">
                  {#each employees as employee}
                    <button
                      type="button"
                      on:click={() => toggleEmployee(employee.id)}
                      disabled={!employee.available}
                      class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-98 {
                        !employee.available
                          ? 'opacity-50 cursor-not-allowed border-neutral-200 dark:border-neutral-700'
                          : projectData.assignedEmployees.includes(employee.id)
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 shadow-lg'
                          : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400'
                      }"
                    >
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {employee.avatar}
                      </div>
                      
                      <div class="flex-1 text-left">
                        <h4 class="font-bold text-neutral-900 dark:text-white">{employee.name}</h4>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400">{employee.role}</p>
                      </div>
                      
                      {#if employee.available}
                        <div class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all {
                          projectData.assignedEmployees.includes(employee.id)
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-neutral-400 dark:border-neutral-500'
                        }">
                          {#if projectData.assignedEmployees.includes(employee.id)}
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                            </svg>
                          {/if}
                        </div>
                      {:else}
                        <span class="px-3 py-1 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 text-xs font-bold rounded-full">
                          Unavailable
                        </span>
                      {/if}
                    </button>
                  {/each}
                </div>
                
                {#if showErrors && errors.assignedEmployees}
                  <p class="mt-2 text-sm text-error-600 font-semibold">{errors.assignedEmployees}</p>
                {/if}

                {#if projectData.assignedEmployees.length > 0}
                  <div class="mt-4 p-4 bg-success-50 dark:bg-success-900/20 border-2 border-success-300 dark:border-success-700 rounded-xl">
                    <p class="text-success-700 dark:text-success-400 font-bold flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {projectData.assignedEmployees.length} member{projectData.assignedEmployees.length > 1 ? 's' : ''} selected
                    </p>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 5: Billing & Budget -->
        {#if currentStep === 5}
          <div in:fly={{ x: 20, duration: 400, easing: cubicOut }}>
            <div class="space-y-5">
              <!-- Client Info -->
              <div class="bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-950/30 dark:to-primary-950/30 rounded-2xl p-5 border-2 border-accent-200 dark:border-accent-800">
                <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Client Information
                </h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      bind:value={projectData.clientName}
                      placeholder="Acme Corporation"
                      class="w-full px-4 py-3 rounded-xl border-2 {showErrors && errors.clientName ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all font-semibold"
                    />
                    {#if showErrors && errors.clientName}
                      <p class="mt-2 text-sm text-error-600 font-semibold">{errors.clientName}</p>
                    {/if}
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                      Client Email
                    </label>
                    <input
                      type="email"
                      bind:value={projectData.clientEmail}
                      placeholder="client@example.com"
                      class="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              <!-- Billing Type -->
              <div>
                <label class="block text-base font-bold text-neutral-900 dark:text-white mb-4">
                  Billing Type
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    on:click={() => projectData.billingType = 'fixed'}
                    class="p-5 rounded-2xl border-2 transition-all active:scale-95 {
                      projectData.billingType === 'fixed'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 shadow-xl'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400'
                    }"
                  >
                    <div class="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center mb-2 mx-auto">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <h4 class="font-bold text-neutral-900 dark:text-white">Fixed Price</h4>
                    <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">One-time payment</p>
                  </button>

                  <button
                    type="button"
                    on:click={() => projectData.billingType = 'hourly'}
                    class="p-5 rounded-2xl border-2 transition-all active:scale-95 {
                      projectData.billingType === 'hourly'
                        ? 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-500 shadow-xl'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-secondary-400'
                    }"
                  >
                    <div class="w-12 h-12 rounded-xl bg-secondary-500 text-white flex items-center justify-center mb-2 mx-auto">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h4 class="font-bold text-neutral-900 dark:text-white">Hourly Rate</h4>
                    <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Pay per hour</p>
                  </button>

                  <button
                    type="button"
                    on:click={() => projectData.billingType = 'milestone'}
                    class="p-5 rounded-2xl border-2 transition-all active:scale-95 {
                      projectData.billingType === 'milestone'
                        ? 'bg-accent-50 dark:bg-accent-900/20 border-accent-500 shadow-xl'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-accent-400'
                    }"
                  >
                    <div class="w-12 h-12 rounded-xl bg-accent-500 text-white flex items-center justify-center mb-2 mx-auto">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                      </svg>
                    </div>
                    <h4 class="font-bold text-neutral-900 dark:text-white">Milestone</h4>
                    <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Pay per milestone</p>
                  </button>
                </div>
              </div>

              <!-- Budget -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    Total Budget
                  </label>
                  <div class="relative">
                    <input
                      type="number"
                      bind:value={projectData.totalBudget}
                      placeholder="0"
                      class="w-full pl-12 pr-4 py-4 rounded-xl border-2 {showErrors && errors.totalBudget ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-bold text-lg"
                    />
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-lg">₹</span>
                  </div>
                  {#if showErrors && errors.totalBudget}
                    <p class="mt-2 text-sm text-error-600 font-semibold">{errors.totalBudget}</p>
                  {/if}
                </div>

                {#if projectData.billingType === 'hourly'}
                  <div>
                    <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                      Hourly Rate
                    </label>
                    <div class="relative">
                      <input
                        type="number"
                        bind:value={projectData.hourlyRate}
                        placeholder="0"
                        class="w-full pl-12 pr-16 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-bold text-lg"
                      />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-lg">₹</span>
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">/hr</span>
                    </div>
                  </div>
                {/if}

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    Currency
                  </label>
                  <select
                    bind:value={projectData.currency}
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-semibold text-base"
                  >
                    <option value="INR">INR - ₹</option>
                    <option value="USD">USD - $</option>
                    <option value="EUR">EUR - €</option>
                    <option value="GBP">GBP - £</option>
                  </select>
                </div>
              </div>

              <!-- Payment Terms -->
              <div>
                <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                  Payment Terms
                </label>
                <textarea
                  bind:value={projectData.paymentTerms}
                  placeholder="e.g., 30% advance, 40% mid-project, 30% on completion..."
                  rows="3"
                  class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-medium resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 6: Server & Deployment -->
        {#if currentStep === 6}
          <div in:fly={{ x: 20, duration: 400, easing: cubicOut }}>
            <div class="space-y-5">
              <!-- Server URLs -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/>
                    </svg>
                    Production Server
                  </label>
                  <input
                    type="url"
                    bind:value={projectData.productionServer}
                    placeholder="https://app.example.com"
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-success-500 focus:ring-4 focus:ring-success-100 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/>
                    </svg>
                    Staging Server
                  </label>
                  <input
                    type="url"
                    bind:value={projectData.stagingServer}
                    placeholder="https://staging.example.com"
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-warning-500 focus:ring-4 focus:ring-warning-100 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                    Domain Name
                  </label>
                  <input
                    type="text"
                    bind:value={projectData.domain}
                    placeholder="example.com"
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-info-500 focus:ring-4 focus:ring-info-100 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    Hosting Provider
                  </label>
                  <input
                    type="text"
                    bind:value={projectData.hosting}
                    placeholder="AWS, DigitalOcean, etc."
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    CI/CD Pipeline
                  </label>
                  <input
                    type="text"
                    bind:value={projectData.cicd}
                    placeholder="GitHub Actions, Jenkins"
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Monitoring Tool
                  </label>
                  <input
                    type="text"
                    bind:value={projectData.monitoring}
                    placeholder="New Relic, Datadog"
                    class="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all font-semibold"
                  />
                </div>
              </div>

              <!-- Info Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div class="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-950/30 dark:to-success-900/30 rounded-xl p-4 border-2 border-success-300 dark:border-success-700">
                  <div class="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-success-900 dark:text-success-300 text-sm">SSL Certificate</h4>
                  <p class="text-xs text-success-700 dark:text-success-400">Secure connection</p>
                </div>

                <div class="bg-gradient-to-br from-info-50 to-info-100 dark:from-info-950/30 dark:to-info-900/30 rounded-xl p-4 border-2 border-info-300 dark:border-info-700">
                  <div class="w-10 h-10 bg-info-500 rounded-lg flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-info-900 dark:text-info-300 text-sm">Backup System</h4>
                  <p class="text-xs text-info-700 dark:text-info-400">Daily backups</p>
                </div>

                <div class="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-950/30 dark:to-warning-900/30 rounded-xl p-4 border-2 border-warning-300 dark:border-warning-700">
                  <div class="w-10 h-10 bg-warning-500 rounded-lg flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-warning-900 dark:text-warning-300 text-sm">Auto Scaling</h4>
                  <p class="text-xs text-warning-700 dark:text-warning-400">Load balancing</p>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Bottom Navigation - Fixed on Mobile -->
      <div class="sticky bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t-2 border-neutral-200 dark:border-neutral-700 p-4 -mx-4 -mb-10 sm:-mx-6 lg:relative lg:mx-0 lg:mb-0 lg:mt-8 lg:border-t-0 lg:pt-8 lg:p-0">
        <div class="flex items-center justify-between gap-3">
          {#if currentStep > 1}
            <button
              type="button"
              on:click={prevStep}
              class="flex-1 lg:flex-initial px-6 py-4 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span class="hidden sm:inline">Previous</span>
              <span class="sm:hidden">Back</span>
            </button>
          {:else}
            <div class="flex-1 lg:hidden"></div>
          {/if}

          {#if currentStep < totalSteps}
            <button
              type="button"
              on:click={nextStep}
              
              class="flex-1 lg:flex-initial px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-800 hover:to-primary-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              <span>Next Step</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          {:else}
            <button
              type="button"
              on:click={submitProject}
              class="flex-1 lg:flex-initial px-10 py-4 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white font-black text-lg rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Create Project</span>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Mobile Bottom Navigation Bar -->
<!-- <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t-2 border-neutral-200 dark:border-neutral-800 shadow-2xl">
  <div class="grid grid-cols-5 h-20 px-2">
    <button
      on:click={() => navigateTo('dashboard')}
      class="flex flex-col items-center justify-center gap-1 transition-all text-neutral-500 dark:text-neutral-400"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
      <span class="text-xs font-bold">Home</span>
    </button>

    <button
      on:click={() => navigateTo('projects')}
      class="flex flex-col items-center justify-center gap-1 transition-all text-neutral-500 dark:text-neutral-400"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
      <span class="text-xs font-bold">Projects</span>
    </button>

    <div class="flex flex-col items-center justify-center -mt-6">
      <div class="w-16 h-16 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white dark:border-neutral-900 text-primary-600">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/>
        </svg>
      </div>
    </div>

    <button
      on:click={() => navigateTo('tasks')}
      class="flex flex-col items-center justify-center gap-1 transition-all text-neutral-500 dark:text-neutral-400"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
      <span class="text-xs font-bold">Tasks</span>
    </button>

    <button
      on:click={() => navigateTo('profile')}
      class="flex flex-col items-center justify-center gap-1 transition-all text-neutral-500 dark:text-neutral-400"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
      <span class="text-xs font-bold">Profile</span>
    </button>
  </div>
</nav> -->

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  .shake {
    animation: shake 0.5s;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #0f9eef, #ff980a);
    border-radius: 10px;
  }

  .dark ::-webkit-scrollbar-track {
    background: #1f2933;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .active\:scale-95:active {
    transform: scale(0.95);
  }

  .active\:scale-98:active {
    transform: scale(0.98);
  }
</style>
