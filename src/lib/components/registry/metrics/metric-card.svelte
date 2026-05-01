<script lang="ts">
  interface Props {
    title: string;
    value: string;
    icon?: string;
    description?: string;
  }
  let { title, value, icon, description }: Props = $props();
</script>

<div class="rounded-lg border bg-card px-6 pb-6 pt-4">
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-muted-foreground">{title}</p>
      {#if icon}
        <span class="text-3xl">{icon}</span>
      {/if}
    </div>
    <p class="text-3xl font-bold tracking-tight">{value}</p>
    {#if description}
      <p class="text-xs text-muted-foreground">{description}</p>
    {/if}
  </div>
</div>
