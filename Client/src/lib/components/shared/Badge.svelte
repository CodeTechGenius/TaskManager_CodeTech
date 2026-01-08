<script>
  export let type = 'default'; // success, warning, danger, info
  export let text = '';
</script>

<span class="badge {
  type === 'success' ? 'badge-success' :
  type === 'warning' ? 'badge-warning' :
  type === 'danger' ? 'badge-danger' :
  type === 'info' ? 'badge-info' :
  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}">
  {text}
  <slot />
</span>
