<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { SvelteURLSearchParams } from 'svelte/reactivity';
  import { t } from '$lib/stores/i18nStore';
  import Input from '$lib/components/ui/input/input.svelte';
  import Search from '@lucide/svelte/icons/search';

  interface Props {
    placeholder?: string;
    resetOtherFilters?: boolean;
  }

  let { placeholder = $t.common.searchPlaceholder, resetOtherFilters = true }: Props = $props();

  let searchFilter = $derived(page.url.searchParams.get('search') || '');

  function handleSearch() {
    const params = resetOtherFilters ? new SvelteURLSearchParams() : new SvelteURLSearchParams(page.url.searchParams);
    params.delete('page');
    if (searchFilter) {
      params.set('search', searchFilter);
    } else {
      params.delete('search');
    }
    gotoParams(params);
  }
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function gotoParams(params: URLSearchParams) {
    // @ts-ignore resolve produces a valid URL but doesn't match SvelteKit's strict route literal types
    goto(resolve(`${page.url.pathname}?${params.toString()}`));
  }
</script>

<div class="relative w-full sm:w-75 md:w-112.5 bg-background">
  <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  <Input type="text" {placeholder} bind:value={searchFilter} onchange={handleSearch} onkeydown={handleKeydown} class="pl-9 w-full" />
</div>
