<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
</script>
<AuthCheck>
    <h1>Photo</h1>
</AuthCheck>