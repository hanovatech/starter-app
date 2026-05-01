<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { SvelteURLSearchParams } from 'svelte/reactivity';
  import * as Select from '$lib/components/ui/select/index.js';

  interface Props {
    key: string;
    defaultValue?: string;
    placeholder?: string;
    options: Array<{ value: string; label: string; }>;
    class?: string;
  }

  let { key, options, defaultValue = '', placeholder = '', class: className = 'w-[220px] bg-background' }: Props = $props();

  const currentValue = $derived(page.url.searchParams.get(key) || defaultValue);
  const currentLabel = $derived(() => {
    const option = options.find(o => o.value === currentValue);
    return option?.label || placeholder;
  });

  function handleValueChange(value: string) {
    const params = new SvelteURLSearchParams(page.url.searchParams);
    params.delete('page');
    if (value) { params.set(key, value); } else { params.delete(key); }
    gotoParams(params);
  }

  function gotoParams(params: URLSearchParams) {
    // @ts-ignore resolve produces a valid URL but doesn't match SvelteKit's strict route literal types
    goto(resolve(`${page.url.pathname}?${params.toString()}`));
  }
</script>

<Select.Root type="single" value={currentValue} onValueChange={handleValueChange}>
  <Select.Trigger class={className}>
    <span data-slot="select-value">{currentLabel()}</span>
  </Select.Trigger>
  <Select.Content>
    {#each options as option (option.value)}
      <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
