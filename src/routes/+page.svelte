<script lang="ts">
  import { t } from '$lib/stores/i18nStore';
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="text-center space-y-4">
    <h1 class="text-4xl font-bold">{$t.app.appName}</h1>
    <p class="text-muted-foreground">{$t.app.subtitle}</p>
    <a href="/login" class="text-primary underline">{$t.common.login}</a>
  </div>
</div>
