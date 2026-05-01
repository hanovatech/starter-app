<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { t } from '$lib/stores/i18nStore';
  import { SvelteURLSearchParams } from 'svelte/reactivity';
  import * as Pagination from '$lib/components/ui/pagination/index.js';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';

  interface Props {
    total: number;
    perPage?: number;
    siblingCount?: number;
    totalLabel?: string;
  }

  let {
    total,
    perPage = 10,
    siblingCount = 1,
    totalLabel,
  }: Props = $props();

  let currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);

  function handlePageChange(newPage: number) {
    const params = new SvelteURLSearchParams(page.url.searchParams);
    if (newPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }
    gotoParams(params);
  }

  function gotoParams(params: URLSearchParams) {
    // @ts-ignore resolve produces a valid URL but doesn't match SvelteKit's strict route literal types
    goto(resolve(`${page.url.pathname}?${params.toString()}`));
  }
</script>

<div class="flex flex-col items-center gap-2">
  <Pagination.Root
    count={total}
    {perPage}
    {siblingCount}
    page={currentPage}
    onPageChange={handlePageChange}
  >
    {#snippet children({ pages })}
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.PrevButton>
            <ChevronLeft class="size-4" />
            <span>{$t.common.previous}</span>
          </Pagination.PrevButton>
        </Pagination.Item>
        {#each pages as p, i (p.type === 'page' ? p.value : `ellipsis-${i}`)}
          {#if p.type === 'ellipsis'}
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
          {:else}
            <Pagination.Item>
              <Pagination.Link page={p} isActive={currentPage === p.value}>
                {p.value}
              </Pagination.Link>
            </Pagination.Item>
          {/if}
        {/each}
        <Pagination.Item>
          <Pagination.NextButton>
            <span>{$t.common.next}</span>
            <ChevronRight class="size-4" />
          </Pagination.NextButton>
        </Pagination.Item>
      </Pagination.Content>
    {/snippet}
  </Pagination.Root>
  <p class="text-sm text-muted-foreground">
    {total} {totalLabel ?? $t.common.entries}
  </p>
</div>
