<script lang="ts">
import {user} from "$lib/firebase"
</script>

{#if $user}
<slot/>
{:else}
<p class="text-error">
    You must be signed in to view this page.
    <a href="/login" class="btn btn-primary ">Sign In</a>
</p>
{/if}