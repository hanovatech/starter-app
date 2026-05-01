<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    title?: string;
    bordered?: boolean;
    children: Snippet;
  }
  let { title, bordered = false, children }: Props = $props();
</script>

<div class="space-y-4 {bordered ? 'border-t pt-6' : ''}">
  {#if title}
    <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h3>
  {/if}
  {@render children()}
</div>
