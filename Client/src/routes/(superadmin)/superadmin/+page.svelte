<script>
  let formData = { email: '', password: '' };
  let errors = {};
  let loading = false;
  let showPassword = false;

  function validateForm() {
    errors = {};
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;
    loading = true;
    // Simulate API call; replace with your Fastify/PostgreSQL auth endpoint
    await new Promise(resolve => setTimeout(resolve, 2000));
    loading = false;
    // On success: goto('/dashboard');
    console.log('Login successful', formData);
  }
</script>

<svelte:head>
  <title>Login - Your App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-rose-500 flex items-center justify-center p-4 relative overflow-hidden">
  <!-- Animated background blobs -->
  <div class="absolute inset-0">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>

  <div class="w-full max-w-md">
    <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative z-10">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-r from-emerald-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p class="text-white/80">Sign in to your account</p>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Email Input -->
        <div>
          <label class="block text-sm font-medium text-white/90 mb-2">Email</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
            <input
              bind:value={formData.email}
              type="email"
              class="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm {errors.email ? 'ring-2 ring-red-400 border-red-400' : ''}"
              placeholder="Enter your email"
              disabled={loading}
            />
            {#if errors.email}
              <p class="mt-1 text-sm text-red-300">{errors.email}</p>
            {/if}
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-sm font-medium text-white/90 mb-2">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input
              bind:value={formData.password}
              type={showPassword ? 'text' : 'password'}
              class="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm {errors.password ? 'ring-2 ring-red-400 border-red-400' : ''}"
              placeholder="Enter your password"
              disabled={loading}
            />
            <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" on:click={() => showPassword = !showPassword}>
              <svg class="h-5 w-5 text-white/50 {showPassword ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg class="h-5 w-5 text-white/50 {!showPassword ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
            {#if errors.password}
              <p class="mt-1 text-sm text-red-300">{errors.password}</p>
            {/if}
          </div>
        </div>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between">
          <label class="flex items-center text-sm text-white/80">
            <input type="checkbox" class="rounded border-white/30 text-emerald-400 focus:ring-emerald-400 w-4 h-4" />
            <span class="ml-2">Remember me</span>
          </label>
          <a href="/forgot-password" class="text-sm text-emerald-200 hover:text-white transition-colors">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={loading}
          class="w-full bg-gradient-to-r from-emerald-500 to-rose-500 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg hover:from-emerald-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
              <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Sign In</span>
          {/if}
        </button>
      </form>

      <!-- Divider & Social (Optional) -->
      <div class="mt-8 text-center">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative inline-block bg-white/10 px-4 py-1 rounded-full text-sm text-white/80">Or continue with</div>
        </div>
        <div class="flex justify-center space-x-4 mt-6">
          <button class="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
          </button>
          <!-- Add GitHub, etc. similarly -->
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>
