<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
    import { api } from '../../../../api/api';

  let email = 'admin@company.com';
  let password = 'admin123';
  let error = '';
  let loading = false;
  let showPassword = false;

  onMount(() => {
    console.log('onMount is called')
  });

  async function handleLogin() {
    error = '';
    loading = true;

    try {
     let {error,errorMsg,token,user} = await api.adminLogin({email,password,role:'admin'})
      if(error) {
        return
      }

      goto('/admin/dashboard');
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Login error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen relative overflow-hidden">
  <!-- Animated Gradient Background -->
  <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-primary-900 to-purple-900">
    <!-- Animated Blobs -->
    <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    
    <!-- Grid Pattern -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
  </div>

  <!-- Back Button -->
  <div class="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
    <button
      on:click={() => goto('/')}
      class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl transition-all text-white shadow-lg"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
      </svg>
      <span class="text-sm font-medium">Back</span>
    </button>
  </div>

  <!-- Main Content -->
  <div class="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-md">
      <!-- Logo Section -->
      <div class="text-center mb-8 sm:mb-10">
        <!-- Animated Logo Container -->
        <div class="relative inline-block mb-6">
          <!-- Outer Glow Ring -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          
          <!-- Logo Circle -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-400 via-primary-500 to-purple-600 rounded-full animate-spin-slow"></div>
            <div class="absolute inset-1 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full flex items-center justify-center backdrop-blur-xl">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
          Admin Portal
        </h1>
        <p class="text-blue-200 text-sm sm:text-base font-medium">
          Sign in to manage your workspace
        </p>
      </div>

      <!-- Login Form - Glassmorphism -->
      <div class="bg-white/10 backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] border border-white/20 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        
        <form on:submit|preventDefault={handleLogin} class="space-y-5 relative z-10">
          <!-- Error Message -->
          {#if error}
            <div class="bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white px-4 py-3 rounded-2xl text-sm flex items-start gap-3 animate-shake shadow-lg">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium">{error}</span>
            </div>
          {/if}

          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-semibold text-white/90 pl-1">
              Email Address
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/50 group-focus-within:text-white/80 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                autocomplete="email"
                class="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40 focus:ring-4 focus:ring-white/10 outline-none transition-all text-base"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-white/90 pl-1">
              Password
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/50 group-focus-within:text-white/80 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                bind:value={password}
                required
                autocomplete="current-password"
                class="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40 focus:ring-4 focus:ring-white/10 outline-none transition-all text-base"
                placeholder="••••••••"
              />
              <button
                type="button"
                on:click={() => showPassword = !showPassword}
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/80 transition"
              >
                {#if showPassword}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                {:else}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                {/if}
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-500 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <span class="ml-2 text-sm text-white/80 group-hover:text-white transition">Remember me</span>
            </label>
            <button type="button" class="text-sm text-blue-300 hover:text-blue-200 transition font-medium">
              Forgot password?
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={loading}
            class="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 via-primary-500 to-purple-600 hover:from-blue-600 hover:via-primary-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
          >
            <!-- Button Shine Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {#if loading}
              <div class="flex items-center justify-center gap-3">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </div>
            {:else}
              <div class="flex items-center justify-center gap-2">
                <span>Sign In</span>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </div>
            {/if}
          </button>
        </form>

        <!-- Switch Link -->
        <div class="mt-6 pt-6 border-t border-white/10 relative z-10">
          <button
            on:click={() => goto('/login/employee')}
            class="w-full text-center py-3 text-sm text-white/70 hover:text-white transition bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-xl"
          >
            Not an admin? <span class="font-bold text-white">Sign in as Employee</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-white/60 text-xs sm:text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Secured with enterprise-grade encryption
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
</style>
