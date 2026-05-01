<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import type { Snippet } from 'svelte';

  interface Tab {
    label: string;
    href: string;
  }

  interface Props {
    tabs: Tab[];
    class?: string;
    triggerClass?: string;
    children: Snippet;
  }

  let { tabs, class: className, triggerClass, children }: Props = $props();

  const selectedValue = $derived.by(() => {
    const currentPath = page.url.pathname;
    const exactMatch = tabs.find(tab => currentPath === tab.href);
    if (exactMatch) return exactMatch.href;

    const prefixMatches = tabs.filter(tab => currentPath.startsWith(tab.href + '/'));
    if (prefixMatches.length > 0) {
      return prefixMatches.reduce((longest, tab) =>
        tab.href.length > longest.href.length ? tab : longest
      ).href;
    }

    return tabs[0]?.href || '';
  });
</script>

<Tabs.Root value={selectedValue}>
  <Tabs.List class={["group-data-horizontal/tabs:h-auto flex w-full flex-wrap", className]}>
    {#each tabs as tab (tab.href)}
      <Tabs.Trigger
        value={tab.href}
        class={triggerClass}
        onclick={() =>
          // @ts-ignore resolve produces a valid URL but doesn't match SvelteKit's strict route literal types
          goto(resolve(tab.href))}
      >
        {tab.label}
      </Tabs.Trigger>
    {/each}
  </Tabs.List>

  <Tabs.Content value={selectedValue} class="mt-6 space-y-6">
    {@render children()}
  </Tabs.Content>
</Tabs.Root>
