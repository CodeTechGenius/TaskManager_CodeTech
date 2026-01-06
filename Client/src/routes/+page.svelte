<main class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-200 via-amber-100 to-white px-4">
  <div class="relative bg-white/80 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-xl w-full animate-fade-in-up">
    <div class="absolute -top-10 left-1/2 -translate-x-1/2">
      <img src="https://raw.githubusercontent.com/github/explore/main/topics/github/github.png" alt="Demo Project" class="w-24 h-24 rounded-full shadow-lg border-4 border-amber-300 ring-4 ring-white animate-bounce-slow" />
    </div>
    <h1 class="mt-16 text-4xl sm:text-5xl font-extrabold text-amber-600 mb-3 text-center drop-shadow-lg animate-fade-in">Demo Project Starter</h1>
    <p class="text-gray-700 text-center mb-6 text-lg sm:text-xl animate-fade-in delay-100">Kickstart your next project with this ready-to-use <span class="font-semibold text-amber-500">SvelteKit</span> + <span class="font-semibold text-amber-500">Tailwind CSS</span> template. Save time on setup and focus on building amazing things!</p>
    <a href="https://github.com/CodeTechGenius/Svelte_Demo_Project" target="_blank" rel="noopener" class="inline-block px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300 animate-fade-in delay-200">View on GitHub</a>
  </div>
  <section class="mt-10 max-w-xl w-full bg-amber-50/90 rounded-2xl p-6 shadow-lg text-gray-700 animate-fade-in-up delay-300">
    <h2 class="text-2xl font-bold mb-3 text-amber-600 flex items-center gap-2"><svg class="w-6 h-6 text-amber-400 animate-spin-slow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v4m0 8v4m8-8h-4M4 12H0m16.24-7.76l-2.83 2.83M7.76 16.24l-2.83 2.83m12.02 0l-2.83-2.83M7.76 7.76L4.93 4.93"/></svg>Instructions</h2>
    <ul class="list-disc list-inside mb-3 space-y-2">
      <li class="transition-all duration-300 hover:pl-2">This project is fully set up with <span class="font-semibold text-amber-500">SvelteKit</span> and <span class="font-semibold text-amber-500">Tailwind CSS</span>.</li>
      <li class="transition-all duration-300 hover:pl-2">To start your own project, simply <span class="font-semibold">remove the content inside <code>+page.svelte</code></span> and begin your new design!</li>
    </ul>
    <p class="font-semibold text-amber-700 animate-pulse">Happy Coding!</p>
    <p class="mt-2 text-sm text-right italic">— CodeTechGenius Software Services Pvt Ltd.</p>
  </section>
  <footer class="mt-10 text-gray-400 text-sm animate-fade-in-up delay-500">Made with <span class="text-amber-400">&#9733;</span> for fast project starts</footer>
</main>

<style lang="postcss">
  @reference "tailwindcss";
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) both;
  }
  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 1s both;
  }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-500 { animation-delay: 0.5s; }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  .animate-bounce-slow {
    animation: bounce-slow 2.5s infinite;
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
</style>