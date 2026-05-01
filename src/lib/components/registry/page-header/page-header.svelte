<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description: string;
    icon?: string;
    children?: Snippet;
  }

  let { title, description, icon, children }: Props = $props();
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h1 class="text-3xl font-bold tracking-tight">
      {#if icon}
        <span class="mr-2">{icon}</span>
      {/if}
      {title}
    </h1>
    <p class="text-sm text-muted-foreground mt-1">
      {description}
    </p>
  </div>
  {#if children}
    {@render children()}
  {/if}
</div>
