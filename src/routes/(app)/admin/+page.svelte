<script lang="ts">
  import { t } from '$lib/stores/i18nStore';
  import { Button } from '$lib/components/ui/button';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{$t.app.appName}</title>
</svelte:head>

<!-- CUSTOMIZE: replace this placeholder with the project's app shell. -->
<div class="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
  <h1 class="text-3xl font-bold">{$t.app.appName}</h1>
  <p class="text-muted-foreground">
    Signed in as <span class="font-medium">{data.user.email}</span>
    ({data.user.role})
  </p>
  <form method="POST" action="/logout">
    <Button type="submit" variant="outline">{$t.common.logout}</Button>
  </form>
</div>
