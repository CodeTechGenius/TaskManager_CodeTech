<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade, scale } from 'svelte/transition';
  
  let loading = true;
  let activeTab = 'overview';
  let isEditing = false;
  let showChangePasswordModal = false;
  let showSuccessMessage = false;
  let successMessage = '';
  
  // User profile data
  let userProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'JD',
    role: 'Lead Developer',
    department: 'Engineering',
    status: 'active',
    joinDate: '2024-01-15',
    location: 'Mumbai, India',
    phone: '+91 98765 43210',
    timezone: 'Asia/Kolkata',
    language: 'English',
    bio: 'Full-stack developer with 8+ years of experience in building scalable web applications. Passionate about clean code and modern technologies.',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'SvelteKit', 'TypeScript'],
    social: {
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      twitter: '@johndoe',
      website: 'johndoe.dev'
    },
    preferences: {
      emailNotifications: true,
      taskUpdates: true,
      projectUpdates: true,
      weeklyReport: false,
      theme: 'auto',
      compactView: false
    }
  };
  
  // Temporary edit data
  let editData = { ...userProfile };
  
  // Stats
  let stats = {
    currentTasks: 8,
    completedTasks: 124,
    activeProjects: 3,
    contributions: 342,
    upcomingDeadlines: 5,
    completionRate: 94
  };
  
  // Activity data
  let recentActivity = [
    { 
      id: 1, 
      type: 'task_completed', 
      title: 'Completed task "Design Homepage UI"', 
      project: 'E-commerce Platform',
      timestamp: '2 hours ago',
      icon: '✅'
    },
    { 
      id: 2, 
      type: 'comment', 
      title: 'Commented on "Payment Gateway Integration"', 
      project: 'E-commerce Platform',
      timestamp: '5 hours ago',
      icon: '💬'
    },
    { 
      id: 3, 
      type: 'task_created', 
      title: 'Created new task "API Documentation"', 
      project: 'CRM Dashboard',
      timestamp: '1 day ago',
      icon: '📝'
    },
    { 
      id: 4, 
      type: 'project_joined', 
      title: 'Joined project "Healthcare Portal"', 
      project: 'Healthcare Portal',
      timestamp: '2 days ago',
      icon: '🎯'
    },
    { 
      id: 5, 
      type: 'task_updated', 
      title: 'Updated progress on "User Authentication"', 
      project: 'Mobile Banking App',
      timestamp: '3 days ago',
      icon: '🔄'
    }
  ];
  
  let currentTasks = [
    { id: 1, title: 'Payment Gateway Integration', project: 'E-commerce Platform', priority: 'urgent', dueDate: '2026-01-11', progress: 75 },
    { id: 2, title: 'Database Optimization', project: 'CRM Dashboard', priority: 'high', dueDate: '2026-01-15', progress: 45 },
    { id: 3, title: 'User Authentication Module', project: 'Healthcare Portal', priority: 'high', dueDate: '2026-01-18', progress: 90 },
    { id: 4, title: 'API Documentation', project: 'CRM Dashboard', priority: 'medium', dueDate: '2026-01-20', progress: 30 }
  ];
  
  let activeProjects = [
    { id: 1, name: 'E-commerce Platform', icon: '🛒', role: 'Lead Developer', tasks: 8, progress: 75 },
    { id: 2, name: 'Mobile Banking App', icon: '📱', role: 'Security Specialist', tasks: 10, progress: 60 },
    { id: 3, name: 'Healthcare Portal', icon: '🏥', role: 'Full Stack Developer', tasks: 6, progress: 85 }
  ];
  
  // Password change data
  let passwordData = {
    current: '',
    new: '',
    confirm: ''
  };
  let passwordErrors = {};
  
  // File upload
  let avatarFile = null;
  
  onMount(async () => {
    await loadProfile();
  });
  
  async function loadProfile() {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      loading = false;
    } catch (error) {
      console.error('Error loading profile:', error);
      loading = false;
    }
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
  
  function startEditing() {
    editData = { ...userProfile };
    isEditing = true;
  }
  
  function cancelEditing() {
    isEditing = false;
    editData = { ...userProfile };
  }
  
  async function saveProfile() {
    // Validate and save profile
    userProfile = { ...editData };
    isEditing = false;
    showSuccess('Profile updated successfully!');
  }
  
  function addSkill(event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      const skill = event.target.value.trim();
      if (!editData.skills.includes(skill)) {
        editData.skills = [...editData.skills, skill];
        event.target.value = '';
      }
    }
  }
  
  function removeSkill(skill) {
    editData.skills = editData.skills.filter(s => s !== skill);
  }
  
  function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
      avatarFile = file;
      // In production, upload to server and get URL
      const reader = new FileReader();
      reader.onload = (e) => {
        // Handle avatar preview
        console.log('Avatar uploaded:', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  
  function openChangePasswordModal() {
    showChangePasswordModal = true;
    passwordData = { current: '', new: '', confirm: '' };
    passwordErrors = {};
  }
  
  function closeChangePasswordModal() {
    showChangePasswordModal = false;
    passwordData = { current: '', new: '', confirm: '' };
    passwordErrors = {};
  }
  
  function validatePassword() {
    passwordErrors = {};
    
    if (!passwordData.current) {
      passwordErrors.current = 'Current password is required';
    }
    
    if (!passwordData.new) {
      passwordErrors.new = 'New password is required';
    } else if (passwordData.new.length < 8) {
      passwordErrors.new = 'Password must be at least 8 characters';
    }
    
    if (passwordData.new !== passwordData.confirm) {
      passwordErrors.confirm = 'Passwords do not match';
    }
    
    return Object.keys(passwordErrors).length === 0;
  }
  
  async function changePassword() {
    if (!validatePassword()) {
      return;
    }
    
    // Implement password change logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    closeChangePasswordModal();
    showSuccess('Password changed successfully!');
  }
  
  async function updatePreferences() {
    // Save preferences
    await new Promise(resolve => setTimeout(resolve, 500));
    showSuccess('Preferences updated successfully!');
  }
  
  function showSuccess(message) {
    successMessage = message;
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
    }, 3000);
  }
  
  function viewTask(id) {
    goto(`/admin/tasks/${id}`);
  }
  
  function viewProject(id) {
    goto(`/admin/projects/${id}`);
  }
</script>

<svelte:head>
  <title>My Profile - Task Manager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  {#if loading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 font-bold text-lg">Loading profile...</p>
      </div>
    </div>
  {:else}
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- Profile Header -->
      <div class="relative rounded-3xl shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div class="relative p-6 lg:p-10 text-white">
          <div class="flex flex-col lg:flex-row gap-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <!-- Avatar -->
              <div class="relative group">
                <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl text-5xl lg:text-6xl font-black">
                  {userProfile.avatar}
                </div>
                <div class="absolute bottom-0 right-0 w-8 h-8 bg-success-500 rounded-full border-4 border-white/30"></div>
              </div>
              
              <!-- Info -->
              <div class="flex-1">
                <h1 class="text-3xl lg:text-4xl font-black tracking-tight mb-2">{userProfile.name}</h1>
                <p class="text-lg font-bold text-primary-100 mb-1">{userProfile.role}</p>
                <p class="text-sm font-semibold text-primary-200 mb-3">{userProfile.department}</p>
                
                <div class="flex flex-wrap gap-3 text-sm">
                  <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-semibold">{userProfile.email}</span>
                  </div>
                  <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="font-semibold">{userProfile.location}</span>
                  </div>
                  <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-semibold">Joined {formatDate(userProfile.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p class="text-3xl font-black">{stats.currentTasks}</p>
                <p class="text-xs font-semibold text-white/80 mt-1">Active Tasks</p>
              </div>
              <div class="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p class="text-3xl font-black">{stats.completedTasks}</p>
                <p class="text-xs font-semibold text-white/80 mt-1">Completed</p>
              </div>
              <div class="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p class="text-3xl font-black">{stats.activeProjects}</p>
                <p class="text-xs font-semibold text-white/80 mt-1">Projects</p>
              </div>
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
            on:click={() => activeTab = 'edit'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'edit'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Edit Profile
          </button>
          <button
            on:click={() => activeTab = 'activity'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'activity'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Activity
          </button>
          <button
            on:click={() => activeTab = 'settings'}
            class="px-4 py-2 rounded-xl font-bold text-sm transition-all {
              activeTab === 'settings'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }"
          >
            Settings
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          {#if activeTab === 'overview'}
            <!-- Bio -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <span class="text-2xl">📝</span>
                About Me
              </h3>
              <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">{userProfile.bio}</p>
            </div>

            <!-- Current Tasks -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  <span class="text-2xl">✅</span>
                  Current Tasks
                </h3>
                <button
                  on:click={() => goto('/admin/tasks')}
                  class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View All
                </button>
              </div>
              <div class="space-y-3">
                {#each currentTasks as task}
                  <button
                    on:click={() => viewTask(task.id)}
                    class="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all text-left"
                  >
                    <div class="flex items-start justify-between gap-3 mb-2">
                      <h4 class="font-bold text-neutral-900 dark:text-white flex-1">{task.title}</h4>
                      <span class="px-2 py-1 rounded-lg text-xs font-bold {getPriorityColor(task.priority)}">
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-2">{task.project}</p>
                    <div class="flex items-center gap-3">
                      <div class="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          class="bg-gradient-to-r {getProgressColor(task.progress)} h-2 rounded-full transition-all duration-500"
                          style="width: {task.progress}%"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-neutral-700 dark:text-neutral-300">{task.progress}%</span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>

            <!-- Active Projects -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  <span class="text-2xl">📁</span>
                  Active Projects
                </h3>
                <button
                  on:click={() => goto('/admin/projects')}
                  class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View All
                </button>
              </div>
              <div class="space-y-3">
                {#each activeProjects as project}
                  <button
                    on:click={() => viewProject(project.id)}
                    class="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                  >
                    <div class="flex items-center gap-3 mb-3">
                      <span class="text-3xl">{project.icon}</span>
                      <div class="flex-1 text-left">
                        <h4 class="font-bold text-neutral-900 dark:text-white">{project.name}</h4>
                        <p class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{project.role} • {project.tasks} tasks</p>
                      </div>
                      <span class="text-lg font-black text-primary-700 dark:text-primary-400">{project.progress}%</span>
                    </div>
                    <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        class="bg-gradient-to-r {getProgressColor(project.progress)} h-2 rounded-full transition-all duration-500"
                        style="width: {project.progress}%"
                      ></div>
                    </div>
                  </button>
                {/each}
              </div>
            </div>

          {:else if activeTab === 'edit'}
            <!-- Edit Profile Form -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8">
              <h3 class="text-2xl font-black text-neutral-900 dark:text-white mb-6">Edit Profile</h3>
              
              <form on:submit|preventDefault={saveProfile} class="space-y-6">
                <!-- Avatar Upload -->
                <div>
                  <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-3">Profile Picture</label>
                  <div class="flex items-center gap-4">
                    <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {editData.avatar}
                    </div>
                    <div class="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        on:change={handleAvatarUpload}
                        class="hidden"
                        id="avatar-upload"
                      />
                      <label
                        for="avatar-upload"
                        class="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl cursor-pointer transition-all"
                      >
                        Upload Photo
                      </label>
                      <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-medium">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                <!-- Name & Email -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="edit-name" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                      Full Name
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      bind:value={editData.name}
                      class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label for="edit-email" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                      Email Address
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      bind:value={editData.email}
                      class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <!-- Phone & Location -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="edit-phone" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      id="edit-phone"
                      type="tel"
                      bind:value={editData.phone}
                      class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label for="edit-location" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                      Location
                    </label>
                    <input
                      id="edit-location"
                      type="text"
                      bind:value={editData.location}
                      class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <!-- Bio -->
                <div>
                  <label for="edit-bio" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                    Bio
                  </label>
                  <textarea
                    id="edit-bio"
                    bind:value={editData.bio}
                    rows="4"
                    class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <!-- Skills -->
                <div>
                  <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    on:keydown={addSkill}
                    class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
                  />
                  <div class="flex flex-wrap gap-2 mt-3">
                    {#each editData.skills as skill}
                      <span class="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-bold flex items-center gap-2">
                        {skill}
                        <button
                          type="button"
                          on:click={() => removeSkill(skill)}
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

                <!-- Social Links -->
                <div class="space-y-4">
                  <h4 class="text-lg font-black text-neutral-900 dark:text-white">Social Links</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="edit-linkedin" class="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        LinkedIn
                      </label>
                      <input
                        id="edit-linkedin"
                        type="text"
                        bind:value={editData.social.linkedin}
                        placeholder="linkedin.com/in/username"
                        class="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label for="edit-github" class="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        GitHub
                      </label>
                      <input
                        id="edit-github"
                        type="text"
                        bind:value={editData.social.github}
                        placeholder="github.com/username"
                        class="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label for="edit-twitter" class="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Twitter
                      </label>
                      <input
                        id="edit-twitter"
                        type="text"
                        bind:value={editData.social.twitter}
                        placeholder="@username"
                        class="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label for="edit-website" class="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Website
                      </label>
                      <input
                        id="edit-website"
                        type="text"
                        bind:value={editData.social.website}
                        placeholder="yourwebsite.com"
                        class="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 pt-4">
                  <button
                    type="submit"
                    class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    on:click={cancelEditing}
                    class="px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

          {:else if activeTab === 'activity'}
            <!-- Recent Activity -->
            <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
              <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <span class="text-2xl">📊</span>
                Recent Activity
              </h3>
              <div class="space-y-3">
                {#each recentActivity as activity}
                  <div class="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl shadow-lg flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-bold text-neutral-900 dark:text-white">{activity.title}</p>
                      <p class="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-1">{activity.project}</p>
                      <p class="text-xs text-neutral-500 dark:text-neutral-500 font-medium mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

          {:else if activeTab === 'settings'}
            <!-- Settings -->
            <div class="space-y-6">
              <!-- Notifications -->
              <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
                <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                  <span class="text-2xl">🔔</span>
                  Notifications
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <div>
                      <p class="font-bold text-neutral-900 dark:text-white">Email Notifications</p>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400">Receive email updates</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={userProfile.preferences.emailNotifications}
                      on:change={updatePreferences}
                      class="w-12 h-6 appearance-none bg-neutral-300 dark:bg-neutral-700 rounded-full relative cursor-pointer transition-colors checked:bg-primary-600 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-6"
                    />
                  </label>
                  
                  <label class="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <div>
                      <p class="font-bold text-neutral-900 dark:text-white">Task Updates</p>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400">Get notified when tasks change</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={userProfile.preferences.taskUpdates}
                      on:change={updatePreferences}
                      class="w-12 h-6 appearance-none bg-neutral-300 dark:bg-neutral-700 rounded-full relative cursor-pointer transition-colors checked:bg-primary-600 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-6"
                    />
                  </label>
                  
                  <label class="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <div>
                      <p class="font-bold text-neutral-900 dark:text-white">Project Updates</p>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400">Receive project notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={userProfile.preferences.projectUpdates}
                      on:change={updatePreferences}
                      class="w-12 h-6 appearance-none bg-neutral-300 dark:bg-neutral-700 rounded-full relative cursor-pointer transition-colors checked:bg-primary-600 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-6"
                    />
                  </label>
                  
                  <label class="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <div>
                      <p class="font-bold text-neutral-900 dark:text-white">Weekly Report</p>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400">Get weekly summary emails</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={userProfile.preferences.weeklyReport}
                      on:change={updatePreferences}
                      class="w-12 h-6 appearance-none bg-neutral-300 dark:bg-neutral-700 rounded-full relative cursor-pointer transition-colors checked:bg-primary-600 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-6"
                    />
                  </label>
                </div>
              </div>

              <!-- Security -->
              <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
                <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                  <span class="text-2xl">🔒</span>
                  Security
                </h3>
                <button
                  on:click={openChangePasswordModal}
                  class="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  Change Password
                </button>
              </div>
            </div>
          {/if}
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Skills -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4">Skills</h3>
            <div class="flex flex-wrap gap-2">
              {#each userProfile.skills as skill}
                <span class="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-bold">
                  {skill}
                </span>
              {/each}
            </div>
          </div>

          <!-- Social Links -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4">Social Links</h3>
            <div class="space-y-3">
              {#if userProfile.social.linkedin}
                <a
                  href="https://{userProfile.social.linkedin}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                >
                  <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">LinkedIn</span>
                </a>
              {/if}
              
              {#if userProfile.social.github}
                <a
                  href="https://{userProfile.social.github}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                >
                  <div class="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">GitHub</span>
                </a>
              {/if}
              
              {#if userProfile.social.twitter}
                <a
                  href="https://twitter.com/{userProfile.social.twitter.replace('@', '')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                >
                  <div class="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">Twitter</span>
                </a>
              {/if}
              
              {#if userProfile.social.website}
                <a
                  href="https://{userProfile.social.website}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                >
                  <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">Website</span>
                </a>
              {/if}
            </div>
          </div>

          <!-- Stats Card -->
          <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-6">
            <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-4">Statistics</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Completion Rate</span>
                <span class="text-lg font-black text-success-700 dark:text-success-400">{stats.completionRate}%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Contributions</span>
                <span class="text-lg font-black text-primary-700 dark:text-primary-400">{stats.contributions}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Upcoming Deadlines</span>
                <span class="text-lg font-black text-warning-700 dark:text-warning-400">{stats.upcomingDeadlines}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Change Password Modal -->
{#if showChangePasswordModal}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade>
    <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 lg:p-8 max-w-md w-full" in:scale={{ duration: 300 }}>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-black text-neutral-900 dark:text-white">Change Password</h3>
        <button
          on:click={closeChangePasswordModal}
          class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
        >
          <svg class="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <form on:submit|preventDefault={changePassword} class="space-y-5">
        <div>
          <label for="current-password" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
            Current Password <span class="text-error-600">*</span>
          </label>
          <input
            id="current-password"
            type="password"
            bind:value={passwordData.current}
            class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {passwordErrors.current ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
          />
          {#if passwordErrors.current}
            <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{passwordErrors.current}</p>
          {/if}
        </div>
        
        <div>
          <label for="new-password" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
            New Password <span class="text-error-600">*</span>
          </label>
          <input
            id="new-password"
            type="password"
            bind:value={passwordData.new}
            class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {passwordErrors.new ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
          />
          {#if passwordErrors.new}
            <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{passwordErrors.new}</p>
          {/if}
        </div>
        
        <div>
          <label for="confirm-password" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
            Confirm New Password <span class="text-error-600">*</span>
          </label>
          <input
            id="confirm-password"
            type="password"
            bind:value={passwordData.confirm}
            class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {passwordErrors.confirm ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
          />
          {#if passwordErrors.confirm}
            <p class="text-error-600 dark:text-error-400 text-sm font-semibold mt-2">{passwordErrors.confirm}</p>
          {/if}
        </div>
        
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            on:click={closeChangePasswordModal}
            class="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Success Message Toast -->
{#if showSuccessMessage}
  <div class="fixed top-6 right-6 z-50" transition:fly={{ y: -20, duration: 300 }}>
    <div class="bg-success-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="font-bold">{successMessage}</span>
    </div>
  </div>
{/if}
