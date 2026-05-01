<script lang="ts">
  import './layout.css';
  import { t } from '$lib/stores/i18nStore';

  let { children } = $props();
</script>

<svelte:head>
  <title>{$t.app.appName}</title>
</svelte:head>

{@render children()}
