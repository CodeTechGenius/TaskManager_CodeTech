<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { fly, fade, scale } from "svelte/transition";

  let loading = true;
  let activeTab = "overview";
  let showEditModal = false;
  let showDeleteModal = false;
  let showSuccessMessage = false;
  let successMessage = "";

  let employeeId = $page.params.id;

  // Employee data
  let employee = null;

  // Edit form data
  let editForm = {};
  let formErrors = {};
  let avatarPreview = null;
  let newSkill = "";

  // Activity data
  let activities = [];
  let tasks = [];
  let projects = [];
  let timesheet = [];

  const roleOptions = [
    { value: "developer", label: "Developer", type: "developer" },
    { value: "lead-developer", label: "Lead Developer", type: "developer" },
    { value: "senior-developer", label: "Senior Developer", type: "developer" },
    { value: "junior-developer", label: "Junior Developer", type: "developer" },
    { value: "designer", label: "UI/UX Designer", type: "designer" },
    { value: "senior-designer", label: "Senior Designer", type: "designer" },
    { value: "project-manager", label: "Project Manager", type: "manager" },
    { value: "product-manager", label: "Product Manager", type: "manager" },
    { value: "qa-engineer", label: "QA Engineer", type: "qa" },
    { value: "senior-qa", label: "Senior QA Engineer", type: "qa" },
    { value: "devops", label: "DevOps Engineer", type: "devops" },
    { value: "senior-devops", label: "Senior DevOps", type: "devops" },
  ];

  const expertiseOptions = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile Development",
    "UI/UX Design",
    "Graphic Design",
    "Project Management",
    "Product Management",
    "Quality Assurance",
    "DevOps & Cloud",
    "Database Administration",
    "Security",
  ];

  onMount(async () => {
    await loadEmployeeData();
  });

  async function loadEmployeeData() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let response = await fetch(
        `http://localhost:5173/api/employee/${employeeId}`,
      );
      let { success, data } = await response.json();
      console.log('data',data)
      // Mock employee data - Replace with actual API call
      employee = data

      // Mock activities
      activities = [
        {
          id: 1,
          type: "task_completed",
          title: 'Completed "Design Homepage UI"',
          project: "E-commerce Platform",
          timestamp: "2 hours ago",
          icon: "✅",
        },
        {
          id: 2,
          type: "comment",
          title: 'Commented on "Payment Gateway"',
          project: "E-commerce Platform",
          timestamp: "5 hours ago",
          icon: "💬",
        },
        {
          id: 3,
          type: "task_created",
          title: 'Created "API Documentation"',
          project: "CRM Dashboard",
          timestamp: "1 day ago",
          icon: "📝",
        },
        {
          id: 4,
          type: "project_joined",
          title: 'Joined "Healthcare Portal"',
          project: "Healthcare Portal",
          timestamp: "2 days ago",
          icon: "🎯",
        },
        {
          id: 5,
          type: "task_updated",
          title: 'Updated "User Authentication"',
          project: "Mobile Banking App",
          timestamp: "3 days ago",
          icon: "🔄",
        },
      ];

      // Mock tasks
      tasks = [
        {
          id: 1,
          title: "Payment Gateway Integration",
          project: "E-commerce Platform",
          priority: "urgent",
          status: "in-progress",
          dueDate: "2026-01-11",
          progress: 75,
        },
        {
          id: 2,
          title: "Database Optimization",
          project: "CRM Dashboard",
          priority: "high",
          status: "in-progress",
          dueDate: "2026-01-15",
          progress: 45,
        },
        {
          id: 3,
          title: "User Authentication Module",
          project: "Healthcare Portal",
          priority: "high",
          status: "in-progress",
          dueDate: "2026-01-18",
          progress: 90,
        },
        {
          id: 4,
          title: "API Documentation",
          project: "CRM Dashboard",
          priority: "medium",
          status: "todo",
          dueDate: "2026-01-20",
          progress: 30,
        },
        {
          id: 5,
          title: "Code Review & Testing",
          project: "E-commerce Platform",
          priority: "high",
          status: "completed",
          dueDate: "2026-01-08",
          progress: 100,
        },
      ];

      // Mock projects
      projects = [
        {
          id: 1,
          name: "E-commerce Platform",
          icon: "🛒",
          role: "Lead Developer",
          status: "active",
          tasks: 8,
          completedTasks: 24,
          progress: 75,
          deadline: "2026-03-15",
        },
        {
          id: 2,
          name: "Mobile Banking App",
          icon: "📱",
          role: "Security Specialist",
          status: "active",
          tasks: 10,
          completedTasks: 45,
          progress: 60,
          deadline: "2026-04-20",
        },
        {
          id: 3,
          name: "Healthcare Portal",
          icon: "🏥",
          role: "Full Stack Developer",
          status: "active",
          tasks: 6,
          completedTasks: 55,
          progress: 85,
          deadline: "2026-02-28",
        },
      ];

      // Mock timesheet
      timesheet = [
        {
          date: "2026-01-10",
          hours: 8,
          task: "Payment Gateway Integration",
          project: "E-commerce Platform",
        },
        {
          date: "2026-01-09",
          hours: 7.5,
          task: "Database Optimization",
          project: "CRM Dashboard",
        },
        {
          date: "2026-01-08",
          hours: 8,
          task: "Code Review & Testing",
          project: "E-commerce Platform",
        },
        {
          date: "2026-01-07",
          hours: 6,
          task: "User Authentication Module",
          project: "Healthcare Portal",
        },
        {
          date: "2026-01-06",
          hours: 8,
          task: "API Documentation",
          project: "CRM Dashboard",
        },
      ];

      loading = false;
    } catch (error) {
      console.error("Error loading employee:", error);
      loading = false;
    }
  }

  function getStatusColor(status) {
    const colors = {
      active:
        "bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400",
      "on-leave":
        "bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400",
      inactive:
        "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400",
    };
    return colors[status] || colors.active;
  }

  function getAvailabilityColor(availability) {
    const colors = {
      available: "bg-success-500",
      busy: "bg-error-500",
      away: "bg-warning-500",
    };
    return colors[availability] || colors.available;
  }

  function getPriorityColor(priority) {
    const colors = {
      urgent:
        "text-error-700 bg-error-100 dark:bg-error-900/30 dark:text-error-400",
      high: "text-warning-700 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400",
      medium:
        "text-info-700 bg-info-100 dark:bg-info-900/30 dark:text-info-400",
      low: "text-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300",
    };
    return colors[priority] || colors.medium;
  }

  function getTaskStatusColor(status) {
    const colors = {
      completed:
        "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
      "in-progress":
        "bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400",
      todo: "bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300",
      blocked:
        "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400",
    };
    return colors[status] || colors.todo;
  }

  function getProgressColor(progress) {
    if (progress >= 80) return "from-success-500 to-success-600";
    if (progress >= 50) return "from-info-500 to-info-600";
    if (progress >= 25) return "from-warning-500 to-warning-600";
    return "from-error-500 to-error-600";
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function openEditModal() {
    editForm = {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      roleType: employee.roleType,
      department: employee.department,
      departmentType: employee.departmentType,
      location: employee.location,
      bio: employee.bio,
      skills: [...employee.skills],
      expertise: employee.expertise,
      experience: employee.experience,
      salary: employee.salary,
      joinDate: employee.joinDate,
      status: employee.status,
    };
    avatarPreview = employee.photoUrl;
    formErrors = {};
    showEditModal = true;
  }

  function closeEditModal() {
    showEditModal = false;
    editForm = {};
    avatarPreview = null;
    formErrors = {};
  }

  function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        formErrors.photo = "File size must be less than 5MB";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function addSkill() {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      editForm.skills = [...editForm.skills, newSkill.trim()];
      newSkill = "";
    }
  }

  function removeSkill(skill) {
    editForm.skills = editForm.skills.filter((s) => s !== skill);
  }

  function handleRoleChange() {
    const selected = roleOptions.find((r) => r.value === editForm.role);
    if (selected) {
      editForm.roleType = selected.type;
    }
  }

  async function saveEmployee() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update employee data
      employee = {
        ...employee,
        ...editForm,
        photoUrl: avatarPreview,
      };

      showSuccess("Employee updated successfully!");
      closeEditModal();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  }

  function openDeleteModal() {
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
  }

  async function deleteEmployee() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Employee deleted successfully!");
      setTimeout(() => {
        goto("/admin/team");
      }, 1000);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }

  function showSuccess(message) {
    successMessage = message;
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
    }, 3000);
  }

  function goBack() {
    goto("/admin/team");
  }

  function viewTask(id) {
    goto(`/admin/tasks/${id}`);
  }

  function viewProject(id) {
    goto(`/admin/projects/${id}`);
  }
</script>

<svelte:head>
  <title>{employee ? `${employee.name} - Team` : "Employee Profile"}</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-24 lg:pb-8"
>
  {#if loading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-16 sm:w-20 h-16 sm:h-20">
          <div
            class="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"
          ></div>
          <div
            class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"
          ></div>
        </div>
        <p
          class="text-neutral-600 dark:text-neutral-400 font-bold text-sm sm:text-lg"
        >
          Loading profile...
        </p>
      </div>
    </div>
  {:else if employee}
    <div class="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <!-- Back Button -->
      <button
        on:click={goBack}
        class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all shadow-lg font-bold text-sm sm:text-base"
      >
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Team
      </button>

      <!-- Profile Header -->
      <div
        class="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-8c00"
        ></div>
        <div
          class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMCA0aDJ2MmgtMnptMC0xMmgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAgNDBoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"
        ></div>

        <div class="relative p-4 sm:p-6 lg:p-10 text-white">
          <div class="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1"
            >
              <!-- Avatar -->
              <div class="relative group">
                {#if employee.photoUrl}
                  <img
                    src={employee.photoUrl}
                    alt={employee.name}
                    class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-3xl object-cover shadow-2xl border-4 border-white/30"
                  />
                {:else}
                  <div
                    class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-3xl bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl text-4xl sm:text-5xl lg:text-6xl font-black"
                  >
                    {employee.avatar}
                  </div>
                {/if}
                <div
                  class="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 {getAvailabilityColor(
                    employee.availability,
                  )} rounded-full border-4 border-white/30"
                ></div>
              </div>

              <!-- Info -->
              <div class="flex-1">
                <div class="flex flex-wrap items-start gap-3 mb-2">
                  <h1
                    class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
                  >
                    {employee.name}
                  </h1>
                  <span
                    class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold border-2 {getStatusColor(
                      employee.status,
                    )}"
                  >
                    {employee.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <p class="text-base sm:text-lg font-bold text-primary-100 mb-1">
                  {employee.role}
                </p>
                <p
                  class="text-xs sm:text-sm font-semibold text-primary-200 mb-3"
                >
                  {employee.department}
                </p>

                <div class="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div
                    class="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-xl border border-white/20"
                  >
                    <svg
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="font-semibold">{employee.email}</span>
                  </div>
                  <div
                    class="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-xl border border-white/20"
                  >
                    <svg
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span class="font-semibold">{employee.phone}</span>
                  </div>
                  <div
                    class="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-xl border border-white/20"
                  >
                    <svg
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span class="font-semibold">{employee.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex sm:flex-col gap-2 sm:gap-3">
              <button
                on:click={openEditModal}
                class="flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-neutral-50 text-primary-700 font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                on:click={openDeleteModal}
                class="flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-3 bg-error-600 hover:bg-error-700 text-white font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div
              class="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20"
            >
              <p class="text-2xl sm:text-3xl font-black">
                {employee.currentTasks}
              </p>
              <p class="text-xs font-semibold text-white/80 mt-1">
                Active Tasks
              </p>
            </div>
            <div
              class="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20"
            >
              <p class="text-2xl sm:text-3xl font-black">
                {employee.completedTasks}
              </p>
              <p class="text-xs font-semibold text-white/80 mt-1">Completed</p>
            </div>
            <div
              class="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20"
            >
              <p class="text-2xl sm:text-3xl font-black">
                {employee.projects.length}
              </p>
              <p class="text-xs font-semibold text-white/80 mt-1">Projects</p>
            </div>
            <div
              class="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20"
            >
              <p class="text-2xl sm:text-3xl font-black">
                {Math.round(
                  (employee.completedTasks / employee.totalTasks) * 100,
                )}%
              </p>
              <p class="text-xs font-semibold text-white/80 mt-1">
                Success Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-lg border-2 border-neutral-200 dark:border-neutral-700 p-2"
      >
        <div class="flex flex-wrap gap-2">
          <button
            on:click={() => (activeTab = "overview")}
            class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all {activeTab ===
            'overview'
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}"
          >
            Overview
          </button>
          <button
            on:click={() => (activeTab = "tasks")}
            class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all {activeTab ===
            'tasks'
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}"
          >
            Tasks
          </button>
          <button
            on:click={() => (activeTab = "projects")}
            class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all {activeTab ===
            'projects'
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}"
          >
            Projects
          </button>
          <button
            on:click={() => (activeTab = "activity")}
            class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all {activeTab ===
            'activity'
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}"
          >
            Activity
          </button>
          <button
            on:click={() => (activeTab = "timesheet")}
            class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all {activeTab ===
            'timesheet'
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-lg'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}"
          >
            Timesheet
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          {#if activeTab === "overview"}
            <!-- Bio -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
            >
              <h3
                class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2"
              >
                <span class="text-xl sm:text-2xl">📝</span>
                About
              </h3>
              <p
                class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed"
              >
                {employee.bio}
              </p>
            </div>

            <!-- Expertise Card -->
            <div
              class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-primary-200 dark:border-primary-800 p-4 sm:p-6"
            >
              <h3
                class="text-lg sm:text-xl font-black text-primary-900 dark:text-primary-100 mb-3 flex items-center gap-2"
              >
                <span class="text-xl sm:text-2xl">🎯</span>
                Expertise & Experience
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p
                    class="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1"
                  >
                    Primary Expertise
                  </p>
                  <p
                    class="text-base sm:text-lg font-black text-primary-800 dark:text-primary-300"
                  >
                    {employee.expertise}
                  </p>
                </div>
                <div>
                  <p
                    class="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1"
                  >
                    Experience
                  </p>
                  <p
                    class="text-base sm:text-lg font-black text-primary-800 dark:text-primary-300"
                  >
                    {employee.experience}
                  </p>
                </div>
                <div>
                  <p
                    class="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1"
                  >
                    Team Size
                  </p>
                  <p
                    class="text-base sm:text-lg font-black text-primary-800 dark:text-primary-300"
                  >
                    {employee.teamSize} Members
                  </p>
                </div>
                <div>
                  <p
                    class="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1"
                  >
                    Reporting To
                  </p>
                  <p
                    class="text-base sm:text-lg font-black text-primary-800 dark:text-primary-300"
                  >
                    {employee.reportingTo}
                  </p>
                </div>
              </div>
            </div>

            <!-- Skills -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
            >
              <h3
                class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2"
              >
                <span class="text-xl sm:text-2xl">💡</span>
                Technical Skills
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each employee.skills as skill}
                  <span
                    class="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-bold"
                  >
                    {skill}
                  </span>
                {/each}
              </div>
            </div>
          {:else if activeTab === "tasks"}
            <!-- Tasks List -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
            >
              <h3
                class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span class="text-xl sm:text-2xl">✅</span>
                All Tasks ({tasks.length})
              </h3>
              <div class="space-y-3">
                {#each tasks as task}
                  <button
                    on:click={() => viewTask(task.id)}
                    class="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all text-left"
                  >
                    <div class="flex items-start justify-between gap-3 mb-2">
                      <h4
                        class="font-bold text-neutral-900 dark:text-white flex-1 text-sm sm:text-base"
                      >
                        {task.title}
                      </h4>
                      <div class="flex gap-2 flex-shrink-0">
                        <span
                          class="px-2 py-1 rounded-lg text-xs font-bold {getPriorityColor(
                            task.priority,
                          )}"
                        >
                          {task.priority.toUpperCase()}
                        </span>
                        <span
                          class="px-2 py-1 rounded-lg text-xs font-bold {getTaskStatusColor(
                            task.status,
                          )}"
                        >
                          {task.status.replace("-", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p
                      class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-2"
                    >
                      {task.project}
                    </p>
                    <div class="flex items-center gap-3">
                      <div
                        class="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2"
                      >
                        <div
                          class="bg-gradient-to-r {getProgressColor(
                            task.progress,
                          )} h-2 rounded-full transition-all duration-500"
                          style="width: {task.progress}%"
                        ></div>
                      </div>
                      <span
                        class="text-xs font-bold text-neutral-700 dark:text-neutral-300"
                        >{task.progress}%</span
                      >
                    </div>
                    <p
                      class="text-xs text-neutral-500 dark:text-neutral-500 mt-2"
                    >
                      Due: {formatDate(task.dueDate)}
                    </p>
                  </button>
                {/each}
              </div>
            </div>
          {:else if activeTab === "projects"}
            <!-- Projects List -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
            >
              <h3
                class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span class="text-xl sm:text-2xl">📁</span>
                Active Projects ({projects.length})
              </h3>
              <div class="space-y-3">
                {#each projects as project}
                  <button
                    on:click={() => viewProject(project.id)}
                    class="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                  >
                    <div class="flex items-center gap-3 mb-3">
                      <span class="text-3xl">{project.icon}</span>
                      <div class="flex-1 text-left">
                        <h4
                          class="font-bold text-neutral-900 dark:text-white text-sm sm:text-base"
                        >
                          {project.name}
                        </h4>
                        <p
                          class="text-xs text-neutral-600 dark:text-neutral-400 font-semibold"
                        >
                          {project.role} • {project.tasks} active tasks
                        </p>
                      </div>
                      <span
                        class="text-lg font-black text-primary-700 dark:text-primary-400"
                        >{project.progress}%</span
                      >
                    </div>
                    <div
                      class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-2"
                    >
                      <div
                        class="bg-gradient-to-r {getProgressColor(
                          project.progress,
                        )} h-2 rounded-full transition-all duration-500"
                        style="width: {project.progress}%"
                      ></div>
                    </div>
                    <div
                      class="flex justify-between text-xs text-neutral-600 dark:text-neutral-400"
                    >
                      <span>{project.completedTasks} tasks completed</span>
                      <span>Due: {formatDate(project.deadline)}</span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {:else if activeTab === "activity"}
            <!-- Activity Feed -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
            >
              <h3
                class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span class="text-xl sm:text-2xl">📊</span>
                Recent Activity
              </h3>
              <div class="space-y-3">
                {#each activities as activity}
                  <div
                    class="flex items-start gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                  >
                    <div
                      class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl shadow-lg flex-shrink-0"
                    >
                      {activity.icon}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-bold text-neutral-900 dark:text-white"
                      >
                        {activity.title}
                      </p>
                      <p
                        class="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-1"
                      >
                        {activity.project}
                      </p>
                      <p
                        class="text-xs text-neutral-500 dark:text-neutral-500 font-medium mt-1"
                      >
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {:else if activeTab === "timesheet"}
            <!-- Timesheet -->
            <div
              class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
            >
              <h3
                class="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span class="text-xl sm:text-2xl">⏱️</span>
                Work Hours
              </h3>
              <div class="space-y-3">
                {#each timesheet as entry}
                  <div
                    class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <p
                        class="text-sm font-bold text-neutral-900 dark:text-white"
                      >
                        {formatDate(entry.date)}
                      </p>
                      <span
                        class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-xs font-black"
                      >
                        {entry.hours} hrs
                      </span>
                    </div>
                    <p
                      class="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      {entry.task}
                    </p>
                    <p
                      class="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-1"
                    >
                      {entry.project}
                    </p>
                  </div>
                {/each}
              </div>
              <div
                class="mt-4 p-4 rounded-xl bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-2 border-success-200 dark:border-success-800"
              >
                <p
                  class="text-sm font-semibold text-success-700 dark:text-success-400 mb-1"
                >
                  Total Hours This Week
                </p>
                <p
                  class="text-3xl font-black text-success-800 dark:text-success-300"
                >
                  {timesheet.reduce((sum, entry) => sum + entry.hours, 0)} hours
                </p>
              </div>
            </div>
          {/if}
        </div>

        <!-- Sidebar -->
        <div class="space-y-4 sm:space-y-6">
          <!-- Quick Info -->
          <div
            class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
          >
            <h3
              class="text-base sm:text-lg font-black text-neutral-900 dark:text-white mb-4"
            >
              Quick Info
            </h3>
            <div class="space-y-3">
              <div>
                <p
                  class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  Login ID
                </p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">
                  {employee.loginId}
                </p>
              </div>
              <div>
                <p
                  class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  Join Date
                </p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">
                  {formatDate(employee.joinDate)}
                </p>
              </div>
              <div>
                <p
                  class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  Salary
                </p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">
                  {employee.salary}
                </p>
              </div>
              <div>
                <p
                  class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  Last Active
                </p>
                <p class="text-sm font-bold text-neutral-900 dark:text-white">
                  {employee.lastActive}
                </p>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          {#if employee.social}
            <div
              class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 sm:p-6"
            >
              <h3
                class="text-base sm:text-lg font-black text-neutral-900 dark:text-white mb-4"
              >
                Social Links
              </h3>
              <div class="space-y-3">
                {#if employee.social.linkedin}
                  <a
                    href="https://{employee.social.linkedin}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-sm font-semibold text-neutral-900 dark:text-white"
                      >LinkedIn</span
                    >
                  </a>
                {/if}

                {#if employee.social.github}
                  <a
                    href="https://{employee.social.github}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-sm font-semibold text-neutral-900 dark:text-white"
                      >GitHub</span
                    >
                  </a>
                {/if}

                {#if employee.social.twitter}
                  <a
                    href="https://twitter.com/{employee.social.twitter.replace(
                      '@',
                      '',
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-sm font-semibold text-neutral-900 dark:text-white"
                      >Twitter</span
                    >
                  </a>
                {/if}

                {#if employee.social.website}
                  <a
                    href="https://{employee.social.website}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 transition-all"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-sm font-semibold text-neutral-900 dark:text-white"
                      >Website</span
                    >
                  </a>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Performance -->
          <div
            class="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-success-200 dark:border-success-800 p-4 sm:p-6"
          >
            <h3
              class="text-base sm:text-lg font-black text-success-900 dark:text-success-100 mb-4"
            >
              Performance
            </h3>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between mb-2">
                  <span
                    class="text-xs font-semibold text-success-700 dark:text-success-400"
                    >Task Completion</span
                  >
                  <span
                    class="text-xs font-black text-success-800 dark:text-success-300"
                    >{Math.round(
                      (employee.completedTasks / employee.totalTasks) * 100,
                    )}%</span
                  >
                </div>
                <div
                  class="w-full bg-success-200 dark:bg-success-900/30 rounded-full h-2"
                >
                  <div
                    class="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full"
                    style="width: {Math.round(
                      (employee.completedTasks / employee.totalTasks) * 100,
                    )}%"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span
                    class="text-xs font-semibold text-success-700 dark:text-success-400"
                    >Project Progress</span
                  >
                  <span
                    class="text-xs font-black text-success-800 dark:text-success-300"
                    >73%</span
                  >
                </div>
                <div
                  class="w-full bg-success-200 dark:bg-success-900/30 rounded-full h-2"
                >
                  <div
                    class="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full"
                    style="width: 73%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h3 class="text-2xl font-black text-neutral-900 dark:text-white mb-2">
          Employee Not Found
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          The employee you're looking for doesn't exist.
        </p>
        <button
          on:click={goBack}
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all"
        >
          Back to Team
        </button>
      </div>
    </div>
  {/if}
</div>

<!-- Edit Modal (Same as team page but pre-filled) -->
{#if showEditModal}
  <div
    class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    transition:fade
  >
    <div
      class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 w-full max-w-3xl my-8"
      in:scale={{ duration: 300 }}
    >
      <!-- Modal content similar to team page -->
      <div
        class="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700"
      >
        <h3
          class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white"
        >
          Edit Employee
        </h3>
        <button
          on:click={closeEditModal}
          class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 dark:text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
        <p class="text-center text-neutral-600 dark:text-neutral-400">
          Edit form (same as add employee form)
        </p>
        <div class="flex justify-end gap-3 mt-6">
          <button
            on:click={closeEditModal}
            class="px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
          >
            Cancel
          </button>
          <button
            on:click={saveEmployee}
            class="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold rounded-xl transition-all shadow-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal}
  <div
    class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    transition:fade
  >
    <div
      class="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-full"
      in:scale={{ duration: 300 }}
    >
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-error-600 dark:text-error-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-neutral-900 dark:text-white mb-2">
          Delete Employee?
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400">
          Are you sure you want to delete <strong>{employee.name}</strong>? This
          action cannot be undone.
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
  <div
    class="fixed top-4 right-4 z-50"
    transition:fly={{ y: -20, duration: 300 }}
  >
    <div
      class="bg-success-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span class="font-bold">{successMessage}</span>
    </div>
  </div>
{/if}
