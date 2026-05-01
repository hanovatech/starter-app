<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { t } from '$lib/stores/i18nStore';
  import { SvelteURLSearchParams } from 'svelte/reactivity';

  interface Props {
    defaultToPreviousMonth?: boolean;
    monthNames?: string[];
  }

  const {
    defaultToPreviousMonth = false,
    monthNames = [
      $t.common.january, $t.common.february, $t.common.march, $t.common.april,
      $t.common.may, $t.common.june, $t.common.july, $t.common.august,
      $t.common.september, $t.common.october, $t.common.november, $t.common.december
    ]
  }: Props = $props();

  const now = $derived.by(() => {
    let d = new Date();
    if (defaultToPreviousMonth) {
      d = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    }
    return d;
  });

  let selectedYear = $state(new Date().getFullYear());
  let selectedMonth = $state(new Date().getMonth() + 1);

  $effect(() => {
    const startDateParam = page.url.searchParams.get('startDate');
    if (startDateParam) {
      const [year, month] = startDateParam.split('-').slice(0, 2);
      selectedYear = parseInt(year);
      selectedMonth = parseInt(month);
    } else {
      selectedYear = now.getFullYear();
      selectedMonth = now.getMonth() + 1;
    }
  });

  const months = $derived(
    Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: monthNames[i]
    })).reverse()
  );

  const currentYear = $derived(now.getFullYear());
  const years = $derived(Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i).reverse());

  function updateUrl() {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const params = new SvelteURLSearchParams(page.url.searchParams);
    params.set('startDate', formatDate(startDate));
    params.set('endDate', formatDate(endDate));
    params.delete('page');
    gotoParams(params);
  }

  function handleMonthChange(month: number) {
    selectedMonth = month;
    updateUrl();
  }

  function handleYearChange(year: number) {
    selectedYear = year;
    updateUrl();
  }

  function goToPrevMonth() {
    if (selectedMonth === 1) {
      selectedMonth = 12;
      selectedYear--;
    } else {
      selectedMonth--;
    }
    updateUrl();
  }

  function goToNextMonth() {
    if (selectedMonth === 12) {
      selectedMonth = 1;
      selectedYear++;
    } else {
      selectedMonth++;
    }
    updateUrl();
  }

  function gotoParams(params: URLSearchParams) {
    // @ts-ignore resolve produces a valid URL but doesn't match SvelteKit's strict route literal types
    goto(resolve(`${page.url.pathname}?${params.toString()}`));
  }
</script>

<ButtonGroup.Root>
  <Button variant="outline" onclick={goToPrevMonth} title="Previous month">
    <ChevronLeft class="w-4 h-4" />
  </Button>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="w-24">
          {monthNames[selectedMonth - 1]}
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      {#each months as month (month.value)}
        <DropdownMenu.Item onclick={() => handleMonthChange(month.value)}>
          {month.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="w-16">
          {selectedYear}
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      {#each years as year (year)}
        <DropdownMenu.Item onclick={() => handleYearChange(year)}>
          {year}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  <Button variant="outline" onclick={goToNextMonth} title="Next month">
    <ChevronRight class="w-4 h-4" />
  </Button>
</ButtonGroup.Root>
