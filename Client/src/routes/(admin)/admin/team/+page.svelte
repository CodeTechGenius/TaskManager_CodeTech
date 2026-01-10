<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fly, fade, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  
  let teamMembers = [];
  let filteredMembers = [];
  let loading = true;
  let searchQuery = '';
  let selectedRole = 'all';
  let selectedDepartment = 'all';
  let selectedSort = 'name';
  let viewMode = 'grid';
  let showFilterPanel = false;
  let showAddModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedMember = null;
  let showSuccessMessage = false;
  let successMessage = '';
  let avatarPreview = null;
  
  let roleFilters = [
    { id: 'all', label: 'All Roles', count: 0 },
    { id: 'developer', label: 'Developer', count: 0 },
    { id: 'designer', label: 'Designer', count: 0 },
    { id: 'manager', label: 'Manager', count: 0 },
    { id: 'qa', label: 'QA Engineer', count: 0 },
    { id: 'devops', label: 'DevOps', count: 0 }
  ];
  
  let departmentFilters = [
    { id: 'all', label: 'All Departments' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'design', label: 'Design' },
    { id: 'product', label: 'Product' },
    { id: 'operations', label: 'Operations' }
  ];
  
  let stats = {
    totalMembers: 0,
    activeMembers: 0,
    departments: 0,
    averageTasksPerMember: 0
  };

  // Employee form data
  let employeeForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    roleType: '',
    department: '',
    departmentType: '',
    location: '',
    bio: '',
    skills: [],
    expertise: '',
    experience: '',
    salary: '',
    joinDate: '',
    status: 'active',
    photo: null
  };

  let newSkill = '';
  let formErrors = {};

  const roleOptions = [
    { value: 'developer', label: 'Developer', type: 'developer' },
    { value: 'lead-developer', label: 'Lead Developer', type: 'developer' },
    { value: 'senior-developer', label: 'Senior Developer', type: 'developer' },
    { value: 'junior-developer', label: 'Junior Developer', type: 'developer' },
    { value: 'designer', label: 'UI/UX Designer', type: 'designer' },
    { value: 'senior-designer', label: 'Senior Designer', type: 'designer' },
    { value: 'project-manager', label: 'Project Manager', type: 'manager' },
    { value: 'product-manager', label: 'Product Manager', type: 'manager' },
    { value: 'qa-engineer', label: 'QA Engineer', type: 'qa' },
    { value: 'senior-qa', label: 'Senior QA Engineer', type: 'qa' },
    { value: 'devops', label: 'DevOps Engineer', type: 'devops' },
    { value: 'senior-devops', label: 'Senior DevOps', type: 'devops' }
  ];

  const expertiseOptions = [
    'Frontend Development', 'Backend Development', 'Full Stack Development',
    'Mobile Development', 'UI/UX Design', 'Graphic Design',
    'Project Management', 'Product Management', 'Quality Assurance',
    'DevOps & Cloud', 'Database Administration', 'Security'
  ];

  onMount(async () => {
    await loadTeamMembers();
  });

  async function loadTeamMembers() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      teamMembers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          loginId: 'john.doe',
          avatar: 'JD',
          photoUrl: null,
          role: 'Lead Developer',
          roleType: 'developer',
          department: 'Engineering',
          departmentType: 'engineering',
          status: 'active',
          joinDate: '2024-01-15',
          location: 'Mumbai, India',
          phone: '+91 98765 43210',
          bio: 'Full-stack developer with 8+ years of experience in building scalable web applications.',
          skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB'],
          expertise: 'Full Stack Development',
          experience: '8+ years',
          salary: '₹15,00,000',
          currentTasks: 8,
          completedTasks: 124,
          projects: ['E-commerce Platform', 'Mobile Banking App', 'Healthcare Portal'],
          availability: 'available',
          lastActive: '2 mins ago'
        },
        {
          id: 2,
          name: 'Sarah Smith',
          email: 'sarah@example.com',
          loginId: 'sarah.smith',
          avatar: 'SS',
          photoUrl: null,
          role: 'Senior UI/UX Designer',
          roleType: 'designer',
          department: 'Design',
          departmentType: 'design',
          status: 'active',
          joinDate: '2024-03-20',
          location: 'Pune, India',
          phone: '+91 98765 43211',
          bio: 'Creative designer passionate about creating beautiful and intuitive user experiences.',
          skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'UI Design', 'User Research'],
          expertise: 'UI/UX Design',
          experience: '6+ years',
          salary: '₹12,00,000',
          currentTasks: 6,
          completedTasks: 98,
          projects: ['E-commerce Platform', 'CRM Dashboard', 'Real Estate Marketplace'],
          availability: 'available',
          lastActive: '15 mins ago'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          loginId: 'mike.johnson',
          avatar: 'MJ',
          photoUrl: null,
          role: 'Backend Developer',
          roleType: 'developer',
          department: 'Engineering',
          departmentType: 'engineering',
          status: 'active',
          joinDate: '2023-11-10',
          location: 'Bangalore, India',
          phone: '+91 98765 43212',
          bio: 'Backend specialist focused on building robust and scalable API architectures.',
          skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kubernetes', 'Microservices'],
          expertise: 'Backend Development',
          experience: '7+ years',
          salary: '₹14,00,000',
          currentTasks: 10,
          completedTasks: 156,
          projects: ['Mobile Banking App', 'CRM Dashboard', 'IoT Dashboard'],
          availability: 'busy',
          lastActive: '1 hour ago'
        }
      ];
      
      calculateStats();
      updateFilterCounts();
      filteredMembers = [...teamMembers];
      loading = false;
    } catch (error) {
      console.error('Error loading team members:', error);
      loading = false;
    }
  }

  function calculateStats() {
    stats.totalMembers = teamMembers.length;
    stats.activeMembers = teamMembers.filter(m => m.status === 'active').length;
    stats.departments = [...new Set(teamMembers.map(m => m.department))].length;
    stats.averageTasksPerMember = Math.round(
      teamMembers.reduce((sum, m) => sum + m.currentTasks, 0) / teamMembers.length
    );
  }

  function updateFilterCounts() {
    roleFilters[0].count = teamMembers.length;
    roleFilters[1].count = teamMembers.filter(m => m.roleType === 'developer').length;
    roleFilters[2].count = teamMembers.filter(m => m.roleType === 'designer').length;
    roleFilters[3].count = teamMembers.filter(m => m.roleType === 'manager').length;
    roleFilters[4].count = teamMembers.filter(m => m.roleType === 'qa').length;
    roleFilters[5].count = teamMembers.filter(m => m.roleType === 'devops').length;
  }

  function filterMembers() {
    let result = [...teamMembers];
    
    if (selectedRole !== 'all') {
      result = result.filter(m => m.roleType === selectedRole);
    }
    
    if (selectedDepartment !== 'all') {
      result = result.filter(m => m.departmentType === selectedDepartment);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.department.toLowerCase().includes(query) ||
        m.skills.some(s => s.toLowerCase().includes(query)) ||
        m.expertise.toLowerCase().includes(query)
      );
    }
    
    switch (selectedSort) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'role':
        result.sort((a, b) => a.role.localeCompare(b.role));
        break;
      case 'tasks':
        result.sort((a, b) => b.currentTasks - a.currentTasks);
        break;
      case 'joinDate':
        result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        break;
    }
    
    filteredMembers = result;
  }

  $: searchQuery, selectedRole, selectedDepartment, selectedSort, filterMembers();

  function getStatusColor(status) {
    const colors = {
      active: 'bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400',
      'on-leave': 'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400',
      inactive: 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400'
    };
    return colors[status] || colors.active;
  }

  function getAvailabilityColor(availability) {
    const colors = {
      available: 'bg-success-500',
      busy: 'bg-error-500',
      away: 'bg-warning-500'
    };
    return colors[availability] || colors.available;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function openAddModal() {
    employeeForm = {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: '',
      roleType: '',
      department: '',
      departmentType: '',
      location: '',
      bio: '',
      skills: [],
      expertise: '',
      experience: '',
      salary: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      photo: null
    };
    avatarPreview = null;
    formErrors = {};
    showAddModal = true;
  }

  function closeAddModal() {
    showAddModal = false;
    employeeForm = {};
    avatarPreview = null;
    formErrors = {};
  }

  function openEditModal(member) {
    selectedMember = member;
    employeeForm = {
      name: member.name,
      email: member.email,
      password: '',
      phone: member.phone,
      role: member.role,
      roleType: member.roleType,
      department: member.department,
      departmentType: member.departmentType,
      location: member.location,
      bio: member.bio,
      skills: [...member.skills],
      expertise: member.expertise,
      experience: member.experience,
      salary: member.salary,
      joinDate: member.joinDate,
      status: member.status,
      photo: null
    };
    avatarPreview = member.photoUrl;
    formErrors = {};
    showEditModal = true;
  }

  function closeEditModal() {
    showEditModal = false;
    selectedMember = null;
    employeeForm = {};
    avatarPreview = null;
    formErrors = {};
  }

  function openDeleteModal(member) {
    selectedMember = member;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    selectedMember = null;
  }

  function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        formErrors.photo = 'File size must be less than 5MB';
        return;
      }
      
      employeeForm.photo = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function addSkill() {
    if (newSkill.trim() && !employeeForm.skills.includes(newSkill.trim())) {
      employeeForm.skills = [...employeeForm.skills, newSkill.trim()];
      newSkill = '';
    }
  }

  function removeSkill(skill) {
    employeeForm.skills = employeeForm.skills.filter(s => s !== skill);
  }

  function handleRoleChange() {
    const selected = roleOptions.find(r => r.value === employeeForm.role);
    if (selected) {
      employeeForm.roleType = selected.type;
    }
  }

  function validateForm() {
    formErrors = {};

    if (!employeeForm.name.trim()) formErrors.name = 'Name is required';
    if (!employeeForm.email.trim()) formErrors.email = 'Email is required';
    if (!employeeForm.role) formErrors.role = 'Role is required';
    if (!employeeForm.department) formErrors.department = 'Department is required';
    if (!employeeForm.phone.trim()) formErrors.phone = 'Phone is required';
    if (!employeeForm.expertise) formErrors.expertise = 'Expertise is required';
    if (!employeeForm.experience) formErrors.experience = 'Experience is required';
    
    if (!showEditModal && !employeeForm.password) {
      formErrors.password = 'Password is required';
    } else if (employeeForm.password && employeeForm.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters';
    }

    return Object.keys(formErrors).length === 0;
  }

  async function saveEmployee() {
    if (!validateForm()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (showEditModal) {
        // Update existing employee
        const index = teamMembers.findIndex(m => m.id === selectedMember.id);
        if (index !== -1) {
          teamMembers[index] = {
            ...teamMembers[index],
            name: employeeForm.name,
            email: employeeForm.email,
            phone: employeeForm.phone,
            role: employeeForm.role,
            roleType: employeeForm.roleType,
            department: employeeForm.department,
            departmentType: employeeForm.departmentType,
            location: employeeForm.location,
            bio: employeeForm.bio,
            skills: employeeForm.skills,
            expertise: employeeForm.expertise,
            experience: employeeForm.experience,
            salary: employeeForm.salary,
            joinDate: employeeForm.joinDate,
            status: employeeForm.status,
            photoUrl: avatarPreview
          };
        }
        showSuccess('Employee updated successfully!');
        closeEditModal();
      } else {
        // Add new employee
        const newEmployee = {
          id: teamMembers.length + 1,
          name: employeeForm.name,
          email: employeeForm.email,
          loginId: employeeForm.email.split('@')[0],
          avatar: employeeForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          photoUrl: avatarPreview,
          role: employeeForm.role,
          roleType: employeeForm.roleType,
          department: employeeForm.department,
          departmentType: employeeForm.departmentType,
          status: employeeForm.status,
          joinDate: employeeForm.joinDate,
          location: employeeForm.location,
          phone: employeeForm.phone,
          bio: employeeForm.bio,
          skills: employeeForm.skills,
          expertise: employeeForm.expertise,
          experience: employeeForm.experience,
          salary: employeeForm.salary,
          currentTasks: 0,
          completedTasks: 0,
          projects: [],
          availability: 'available',
          lastActive: 'Just now'
        };
        
        teamMembers = [...teamMembers, newEmployee];
        showSuccess('Employee added successfully!');
        closeAddModal();
      }

      calculateStats();
      updateFilterCounts();
      filterMembers();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  }

  async function deleteEmployee() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      teamMembers = teamMembers.filter(m => m.id !== selectedMember.id);
      calculateStats();
      updateFilterCounts();
      filterMembers();
      
      showSuccess('Employee deleted successfully!');
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

  function showSuccess(message) {
    successMessage = message;
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
    }, 3000);
  }

  function viewMember(id) {
    goto(`/admin/team/${id}`);
  }
</script>

<svelte:head>
  <title>Team - Task Manager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8">
  <div class="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
    
    <!-- Page Header -->
    <div class="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div class="relative p-4 sm:p-6 lg:p-10 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl">
                <span class="text-2xl sm:text-3xl lg:text-4xl">👥</span>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">Team</h1>
                <p class="text-primary-100 text-xs sm:text-sm lg:text-base font-medium mt-1">
                  Manage your team members
                </p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div class="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <span class="text-lg sm:text-2xl font-black">{stats.totalMembers}</span>
                <span class="text-xs sm:text-sm font-semibold">Total</span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success-400 rounded-full animate-pulse"></div>
                <span class="text-xs sm:text-sm font-semibold">{stats.activeMembers} Active</span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <span class="text-xs sm:text-sm font-semibold">{stats.departments} Depts</span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/20">
                <span class="text-xs sm:text-sm font-semibold">{stats.averageTasksPerMember} Avg</span>
              </div>
            </div>
          </div>
          
          <button
            on:click={openAddModal}
            class="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-white hover:bg-neutral-50 text-primary-700 font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group transform hover:scale-105 text-sm sm:text-base"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="hidden sm:inline">Add Employee</span>
            <span class="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-16 sm:w-20 h-16 sm:h-20">
            <div class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400 font-bold text-sm sm:text-lg">Loading team...</p>
        </div>
      </div>
    {:else}
      
      <!-- Filters and Search Bar -->
      <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-3 sm:p-4 lg:p-6">
        <button
          on:click={() => showFilterPanel = !showFilterPanel}
          class="lg:hidden w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-3 sm:mb-4 font-bold text-sm sm:text-base text-primary-700 dark:text-primary-400"
        >
          <span>Filters & Search</span>
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform {showFilterPanel ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <div class="space-y-3 sm:space-y-4 {showFilterPanel ? 'block' : 'hidden lg:block'}">
          <!-- Search Bar -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search by name, email, skills..."
              class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 lg:py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
            />
            {#if searchQuery}
              <button
                on:click={() => searchQuery = ''}
                class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            {/if}
          </div>

          <!-- Role Filter Tabs -->
          <div class="flex flex-wrap gap-1.5 sm:gap-2">
            {#each roleFilters as filter}
              <button
                on:click={() => selectedRole = filter.id}
                class="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all {
                  selectedRole === filter.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500 scale-105 shadow-lg'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
              >
                {filter.label}
                <span class="ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 text-xs font-black">
                  {filter.count}
                </span>
              </button>
            {/each}
          </div>

          <!-- Department and View Options -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <label class="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300">Dept:</label>
              <select
                bind:value={selectedDepartment}
                class="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                {#each departmentFilters as filter}
                  <option value={filter.id}>{filter.label}</option>
                {/each}
              </select>

              <label class="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300">Sort:</label>
              <select
                bind:value={selectedSort}
                class="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="name">Name</option>
                <option value="role">Role</option>
                <option value="tasks">Tasks</option>
                <option value="joinDate">Join Date</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <button
                on:click={() => viewMode = 'grid'}
                class="p-2 rounded-lg sm:rounded-xl transition-all {
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                on:click={() => viewMode = 'list'}
                class="p-2 rounded-lg sm:rounded-xl transition-all {
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Count -->
      {#if searchQuery || selectedRole !== 'all' || selectedDepartment !== 'all'}
        <div class="flex items-center justify-between px-2">
          <p class="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Found {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
          </p>
          {#if searchQuery || selectedRole !== 'all' || selectedDepartment !== 'all'}
            <button
              on:click={() => { searchQuery = ''; selectedRole = 'all'; selectedDepartment = 'all'; }}
              class="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filters
            </button>
          {/if}
        </div>
      {/if}

      <!-- Team Members View -->
      {#if filteredMembers.length === 0}
        <div class="flex flex-col items-center justify-center py-16 sm:py-20 bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <div class="w-16 sm:w-24 h-16 sm:h-24 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <svg class="w-8 sm:w-12 h-8 sm:h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-2">No members found</h3>
          <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6 text-center px-4">Try adjusting filters or add new member</p>
          <button
            on:click={openAddModal}
            class="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-xl transition-all text-sm sm:text-base"
          >
            Add Employee
          </button>
        </div>
      {:else if viewMode === 'grid'}
        <!-- Grid View - Mobile App Style Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {#each filteredMembers as member (member.id)}
            <div
              in:fly={{ y: 20, duration: 300 }}
              class="group bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div class="p-4 sm:p-6">
                <!-- Avatar and Actions -->
                <div class="flex items-start justify-between mb-3 sm:mb-4">
                  <div class="relative">
                    {#if member.photoUrl}
                      <img src={member.photoUrl} alt={member.name} class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg" />
                    {:else}
                      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg">
                        {member.avatar}
                      </div>
                    {/if}
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 {getAvailabilityColor(member.availability)} rounded-full border-4 border-white dark:border-neutral-800"></div>
                  </div>
                  
                  <div class="flex gap-1 sm:gap-2">
                    <button
                      on:click={() => openEditModal(member)}
                      class="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-all"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      on:click={() => openDeleteModal(member)}
                      class="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-800/50 transition-all"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Name, Role & Status -->
                <div class="mb-3 sm:mb-4">
                  <h3 class="text-base sm:text-xl font-black text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1 truncate">
                    {member.name}
                  </h3>
                  <p class="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 truncate">{member.role}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold border-2 {getStatusColor(member.status)}">
                      {member.status.toUpperCase()}
                    </span>
                    <p class="text-xs text-neutral-500 dark:text-neutral-500 font-medium truncate">{member.department}</p>
                  </div>
                </div>

                <!-- Expertise -->
                <div class="mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800">
                  <p class="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1">Expertise</p>
                  <p class="text-sm font-black text-primary-700 dark:text-primary-400">{member.expertise}</p>
                  <p class="text-xs text-primary-600 dark:text-primary-500 font-semibold mt-1">{member.experience}</p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div class="p-2 sm:p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <p class="text-lg sm:text-2xl font-black text-primary-700 dark:text-primary-400">{member.currentTasks}</p>
                    <p class="text-xs font-semibold text-primary-600 dark:text-primary-500">Current</p>
                  </div>
                  <div class="p-2 sm:p-3 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                    <p class="text-lg sm:text-2xl font-black text-success-700 dark:text-success-400">{member.completedTasks}</p>
                    <p class="text-xs font-semibold text-success-600 dark:text-success-500">Done</p>
                  </div>
                </div>

                <!-- Skills -->
                <div class="mb-3 sm:mb-4">
                  <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Skills</p>
                  <div class="flex flex-wrap gap-1.5">
                    {#each member.skills.slice(0, 3) as skill}
                      <span class="px-2 py-0.5 sm:py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    {/each}
                    {#if member.skills.length > 3}
                      <span class="px-2 py-0.5 sm:py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold">
                        +{member.skills.length - 3}
                      </span>
                    {/if}
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="pt-3 sm:pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-1.5 sm:space-y-2">
                  <div class="flex items-center gap-2 text-xs">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-semibold text-neutral-600 dark:text-neutral-400 truncate">{member.email}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span class="font-semibold text-neutral-600 dark:text-neutral-400">{member.phone}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="font-semibold text-neutral-600 dark:text-neutral-400">Active: {member.lastActive}</span>
                  </div>
                </div>

                <!-- View Details Button -->
                <button
                  on:click={() => viewMember(member.id)}
                  class="w-full mt-3 sm:mt-4 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- List View - Compact for Mobile -->
        <div class="space-y-3 sm:space-y-4">
          {#each filteredMembers as member (member.id)}
            <div
              in:fly={{ y: 20, duration: 400, delay: 50 }}
              class="group bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div class="p-4 sm:p-6">
                <div class="flex gap-3 sm:gap-4">
                  <!-- Avatar -->
                  <div class="relative flex-shrink-0">
                    {#if member.photoUrl}
                      <img src={member.photoUrl} alt={member.name} class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover shadow-lg" />
                    {:else}
                      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-lg">
                        {member.avatar}
                      </div>
                    {/if}
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 {getAvailabilityColor(member.availability)} rounded-full border-3 sm:border-4 border-white dark:border-neutral-800"></div>
                  </div>
                  
                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="flex-1 min-w-0">
                        <h3 class="text-base sm:text-xl font-black text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                          {member.name}
                        </h3>
                        <p class="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 truncate">{member.role} • {member.department}</p>
                      </div>
                      <span class="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold border-2 {getStatusColor(member.status)} flex-shrink-0">
                        {member.status === 'active' ? '✓' : '○'}
                      </span>
                    </div>
                    
                    <div class="space-y-2 mb-3">
                      <div class="flex items-center gap-1.5 sm:gap-2 text-xs">
                        <span class="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded font-bold">
                          {member.expertise}
                        </span>
                        <span class="text-neutral-500 dark:text-neutral-500 font-medium">{member.experience}</span>
                      </div>
                      
                      <div class="flex flex-wrap gap-1">
                        {#each member.skills.slice(0, 2) as skill}
                          <span class="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs font-semibold">
                            {skill}
                          </span>
                        {/each}
                        {#if member.skills.length > 2}
                          <span class="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs font-bold">
                            +{member.skills.length - 2}
                          </span>
                        {/if}
                      </div>
                    </div>

                    <!-- Stats and Actions -->
                    <div class="flex items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <div class="flex gap-3 sm:gap-4 text-xs">
                        <div>
                          <span class="font-black text-primary-700 dark:text-primary-400">{member.currentTasks}</span>
                          <span class="text-neutral-600 dark:text-neutral-400 font-medium ml-1">Active</span>
                        </div>
                        <div>
                          <span class="font-black text-success-700 dark:text-success-400">{member.completedTasks}</span>
                          <span class="text-neutral-600 dark:text-neutral-400 font-medium ml-1">Done</span>
                        </div>
                      </div>
                      
                      <div class="flex gap-1.5 sm:gap-2">
                        <button
                          on:click={() => viewMember(member.id)}
                          class="p-1.5 sm:p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-all"
                          title="View"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button
                          on:click={() => openEditModal(member)}
                          class="p-1.5 sm:p-2 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-800/50 transition-all"
                          title="Edit"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          on:click={() => openDeleteModal(member)}
                          class="p-1.5 sm:p-2 rounded-lg bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-800/50 transition-all"
                          title="Delete"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
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

<!-- Add/Edit Employee Modal -->
{#if showAddModal || showEditModal}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" transition:fade>
    <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col" in:scale={{ duration: 300 }}>
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
        <h3 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
          <span class="text-2xl sm:text-3xl">{showEditModal ? '✏️' : '➕'}</span>
          {showEditModal ? 'Edit Employee' : 'Add New Employee'}
        </h3>
        <button
          on:click={showEditModal ? closeEditModal : closeAddModal}
          class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Modal Body - Scrollable -->
      <div class="overflow-y-auto flex-1 p-4 sm:p-6">
        <form on:submit|preventDefault={saveEmployee} class="space-y-4 sm:space-y-6">
          <!-- Photo Upload -->
          <div>
            <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-3">Profile Photo</label>
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg overflow-hidden">
                {#if avatarPreview}
                  <img src={avatarPreview} alt="Preview" class="w-full h-full object-cover" />
                {:else}
                  📷
                {/if}
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  on:change={handlePhotoUpload}
                  class="hidden"
                  id="photo-upload"
                />
                <label
                  for="photo-upload"
                  class="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl cursor-pointer transition-all text-sm"
                >
                  Upload Photo
                </label>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-medium">JPG, PNG. Max 5MB</p>
                {#if formErrors.photo}
                  <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.photo}</p>
                {/if}
              </div>
            </div>
          </div>

          <!-- Personal Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Full Name <span class="text-error-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                bind:value={employeeForm.name}
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.name ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              />
              {#if formErrors.name}
                <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.name}</p>
              {/if}
            </div>

            <div>
              <label for="email" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Email <span class="text-error-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                bind:value={employeeForm.email}
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.email ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              />
              {#if formErrors.email}
                <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.email}</p>
              {/if}
            </div>
          </div>

          <!-- Password & Phone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div>
  <label for="password" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
    Password 
    {#if !showEditModal}
      <span class="text-error-600">*</span>
    {/if}
    {#if showEditModal}
      <span class="text-xs text-neutral-500">(Leave empty to keep current)</span>
    {/if}
  </label>
  <input
    id="password"
    type="password"
    bind:value={employeeForm.password}
    class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.password ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
  />
  {#if formErrors.password}
    <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.password}</p>
  {/if}
</div>

            <div>
              <label for="phone" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Phone <span class="text-error-600">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                bind:value={employeeForm.phone}
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.phone ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              />
              {#if formErrors.phone}
                <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.phone}</p>
              {/if}
            </div>
          </div>

          <!-- Role & Department -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="role" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Role <span class="text-error-600">*</span>
              </label>
              <select
                id="role"
                bind:value={employeeForm.role}
                on:change={handleRoleChange}
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.role ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              >
                <option value="">Select role...</option>
                {#each roleOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
              {#if formErrors.role}
                <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.role}</p>
              {/if}
            </div>

            <div>
              <label for="department" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Department <span class="text-error-600">*</span>
              </label>
              <select
                id="department"
                bind:value={employeeForm.departmentType}
                on:change={() => {
                  const depts = {engineering: 'Engineering', design: 'Design', product: 'Product', operations: 'Operations'};
                  employeeForm.department = depts[employeeForm.departmentType] || '';
                }}
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.department ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              >
                <option value="">Select department...</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="product">Product</option>
                <option value="operations">Operations</option>
              </select>
              {#if formErrors.department}
                <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.department}</p>
              {/if}
            </div>
          </div>

          <!-- Expertise, Experience, Location -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label for="expertise" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Expertise <span class="text-error-600">*</span>
              </label>
              <select
                id="expertise"
                bind:value={employeeForm.expertise}
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.expertise ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              >
                <option value="">Select...</option>
                {#each expertiseOptions as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
              {#if formErrors.expertise}
                <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.expertise}</p>
              {/if}
            </div>

            <div>
              <label for="experience" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Experience <span class="text-error-600">*</span>
              </label>
              <input
                id="experience"
                type="text"
                bind:value={employeeForm.experience}
                placeholder="e.g. 5+ years"
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 {formErrors.experience ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              />
              {#if formErrors.experience}
                <p class="text-error-600 dark:text-error-400 text-xs font-semibold mt-1">{formErrors.experience}</p>
              {/if}
            </div>

            <div>
              <label for="location" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                bind:value={employeeForm.location}
                placeholder="City, Country"
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              />
            </div>
          </div>

          <!-- Salary & Join Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="salary" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Salary (Annual)
              </label>
              <input
                id="salary"
                type="text"
                bind:value={employeeForm.salary}
                placeholder="₹12,00,000"
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium"
              />
            </div>

            <div>
              <label for="joinDate" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Join Date
              </label>
              <input
                id="joinDate"
                type="date"
                bind:value={employeeForm.joinDate}
                class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-semibold"
              />
            </div>
          </div>

          <!-- Bio -->
          <div>
            <label for="bio" class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              bind:value={employeeForm.bio}
              rows="3"
              class="w-full px-4 py-2.5 sm:py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-medium resize-none"
            ></textarea>
          </div>

          <!-- Skills -->
          <div>
            <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
              Skills
            </label>
            <div class="flex gap-2 mb-3">
              <input
                type="text"
                bind:value={newSkill}
                placeholder="Add a skill..."
                on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                class="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
              />
              <button
                type="button"
                on:click={addSkill}
                class="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all text-sm"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each employeeForm.skills as skill}
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

          <!-- Status -->
          <div>
            <label class="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
              Status
            </label>
            <div class="flex gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  bind:group={employeeForm.status}
                  value="active"
                  class="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <span class="text-sm font-semibold text-neutral-900 dark:text-white">Active</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  bind:group={employeeForm.status}
                  value="on-leave"
                  class="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <span class="text-sm font-semibold text-neutral-900 dark:text-white">On Leave</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  bind:group={employeeForm.status}
                  value="inactive"
                  class="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <span class="text-sm font-semibold text-neutral-900 dark:text-white">Inactive</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              on:click={showEditModal ? closeEditModal : closeAddModal}
              class="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl text-sm sm:text-base"
            >
              {showEditModal ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" transition:fade>
    <div class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-full" in:scale={{ duration: 300 }}>
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-black text-neutral-900 dark:text-white mb-2">Delete Employee?</h3>
        <p class="text-neutral-600 dark:text-neutral-400">
          Are you sure you want to delete <strong>{selectedMember?.name}</strong>? This action cannot be undone.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          on:click={closeDeleteModal}
          class="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
        >
          Cancel
        </button>
        <button
          on:click={deleteEmployee}
          class="flex-1 px-6 py-3 bg-error-600 hover:bg-error-700 text-white font-bold rounded-xl transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Success Toast -->
{#if showSuccessMessage}
  <div class="fixed top-4 right-4 z-50" transition:fly={{ y: -20, duration: 300 }}>
    <div class="bg-success-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="font-bold">{successMessage}</span>
    </div>
  </div>
{/if}
