<script>
  export let title = '';
  export let subtitle = '';
  export let padding = 'p-6';
</script>

<div class="card {padding}">
  {#if title}
    <div class="mb-4 {subtitle ? 'pb-4 border-b border-gray-200 dark:border-gray-700' : ''}">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      {#if subtitle}
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
      {/if}
    </div>
  {/if}
  
  <slot />
</div>
