<script lang="ts">
  import { page } from '$app/state';
  import { t } from '$lib/stores/i18nStore';
  import * as Card from '$lib/components/ui/card';
  import * as Alert from '$lib/components/ui/alert';
  import Mail from '@lucide/svelte/icons/mail';
  import Terminal from '@lucide/svelte/icons/terminal';

  const isDev = $derived(page.data.appMode === 'dev');
</script>

<svelte:head>
  <title>{$t.auth.verifyRequest.heading} · {$t.app.appName}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center p-4">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="text-center">
      <div class="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
        <Mail class="size-6" />
      </div>
      <Card.Title>{$t.auth.verifyRequest.heading}</Card.Title>
      <Card.Description>{$t.auth.verifyRequest.description}</Card.Description>
    </Card.Header>
    {#if isDev}
      <Card.Content>
        <Alert.Root>
          <Terminal class="size-4" />
          <Alert.Title>{$t.auth.verifyRequest.devModeLogin}</Alert.Title>
          <Alert.Description>{$t.auth.verifyRequest.devModeLoginDescription}</Alert.Description>
        </Alert.Root>
      </Card.Content>
    {/if}
  </Card.Root>
</div>
