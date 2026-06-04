<script lang="ts">
  import { t } from '$lib/stores/i18nStore';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import ShieldAlert from '@lucide/svelte/icons/shield-alert';
</script>

<svelte:head>
  <title>{$t.auth.unknownUser.heading} · {$t.app.appName}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center p-4">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="text-center">
      <div class="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
        <ShieldAlert class="size-6" />
      </div>
      <Card.Title>{$t.auth.unknownUser.heading}</Card.Title>
      <Card.Description>{$t.auth.unknownUser.description}</Card.Description>
    </Card.Header>
    <Card.Content>
      <form method="POST" action="/logout" class="flex justify-center">
        <Button type="submit" variant="outline">{$t.auth.unknownUser.toLoginPage}</Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
