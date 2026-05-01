<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
  import Calendar from '@lucide/svelte/icons/calendar';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
  import { t } from '$lib/stores/i18nStore';
  import { SvelteURLSearchParams } from 'svelte/reactivity';

  interface Props {
    value?: { start: DateValue | undefined; end: DateValue | undefined };
    showYearNavigation?: boolean;
    pickDateRangeLabel?: string;
    clearLabel?: string;
    applyLabel?: string;
  }

  let {
    value = $bindable({ start: undefined, end: undefined }),
    showYearNavigation = false,
    pickDateRangeLabel = $t.common.pickDateRange,
    clearLabel = $t.common.clear,
    applyLabel = $t.common.apply
  }: Props = $props();

  const isFullYear = $derived.by(() => {
    if (!value.start || !value.end) return false;
    return value.start.month === 1 && value.start.day === 1 &&
           value.end.month === 12 && value.end.day === 31 &&
           value.start.year === value.end.year;
  });

  const currentYear = $derived(value.start?.year ?? new Date().getFullYear());

  const dateRangeLabel = $derived.by(() => {
    if (!value.start && !value.end) return pickDateRangeLabel;

    if (value.start && value.end && isFullYear) {
      return `${value.start.year}`;
    }

    const formatDate = (dateValue: DateValue) => {
      const date = dateValue.toDate(getLocalTimeZone());
      return date.toLocaleDateString();
    };

    if (value.start && value.end) {
      return `${formatDate(value.start)} - ${formatDate(value.end)}`;
    }
    if (value.start) {
      return `From ${formatDate(value.start)}`;
    }
    return pickDateRangeLabel;
  });

  function applyFilter() {
    const params = new SvelteURLSearchParams(page.url.searchParams);
    params.delete('page');

    if (value.start) {
      const startDate = value.start.toDate(getLocalTimeZone());
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      params.set('startDate', `${year}-${month}-${day}`);
    }
    if (value.end) {
      const endDate = value.end.toDate(getLocalTimeZone());
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      params.set('endDate', `${year}-${month}-${day}`);
    }
    gotoParams(params);
  }

  function clearFilter() {
    value = { start: undefined, end: undefined };
    const params = new SvelteURLSearchParams(page.url.searchParams);
    params.delete('startDate');
    params.delete('endDate');
    params.delete('page');
    gotoParams(params);
  }

  function navigateYear(delta: number) {
    const newYear = currentYear + delta;
    value = {
      start: new CalendarDate(newYear, 1, 1),
      end: new CalendarDate(newYear, 12, 31)
    };
    const params = new SvelteURLSearchParams(page.url.searchParams);
    params.delete('page');
    params.set('startDate', `${newYear}-01-01`);
    params.set('endDate', `${newYear}-12-31`);
    gotoParams(params);
  }

  function gotoParams(params: URLSearchParams) {
    // @ts-ignore resolve produces a valid URL but doesn't match SvelteKit's strict route literal types
    goto(resolve(`${page.url.pathname}?${params.toString()}`));
  }
</script>

<div class="flex items-center gap-0">
  {#if showYearNavigation}
    <Button variant="outline" class="rounded-r-none border-r-0" onclick={() => navigateYear(-1)}>
      <ChevronLeft class="h-4 w-4" />
    </Button>
  {/if}

  <Popover.Root>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="min-w-35 justify-start {showYearNavigation ? 'rounded-none' : ''}">
          <Calendar class="mr-2 h-4 w-4" />
          {dateRangeLabel}
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content align="start" class="w-auto p-0">
      <RangeCalendar bind:value />
      <div class="flex gap-2 p-3 border-t">
        <Button size="sm" variant="outline" onclick={clearFilter} class="flex-1">
          {clearLabel}
        </Button>
        <Button size="sm" onclick={applyFilter} class="flex-1">
          {applyLabel}
        </Button>
      </div>
    </Popover.Content>
  </Popover.Root>

  {#if showYearNavigation}
    <Button variant="outline" class="rounded-l-none border-l-0" onclick={() => navigateYear(1)}>
      <ChevronRight class="h-4 w-4" />
    </Button>
  {/if}
</div>
