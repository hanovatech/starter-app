<script lang="ts">
  import { t } from '$lib/stores/i18nStore';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
  <title>{$t.common.login} · {$t.app.appName}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center p-4">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="text-center">
      <Card.Title class="text-2xl">{$t.app.appName}</Card.Title>
      <Card.Description>{$t.app.subtitle}</Card.Description>
    </Card.Header>
    <Card.Content>
      <form method="POST" class="space-y-4">
        <input type="hidden" name="providerId" value="postmark" />
        <div class="space-y-2">
          <Label for="email">{$t.common.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" class="w-full">{$t.common.login}</Button>
        <p class="text-center text-xs text-muted-foreground">{$t.auth.login.terms}</p>
      </form>
    </Card.Content>
  </Card.Root>
</div>
