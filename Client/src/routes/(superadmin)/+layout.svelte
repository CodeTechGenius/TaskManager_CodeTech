<script>
    import { onMount } from "svelte";
    import '../../app.css'
    onMount(() => {
        console.log("superadmin ...");
    });
</script>

<slot />
