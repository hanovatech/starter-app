<script lang="ts">
  import MetricCard from "./metric-card.svelte";

  interface Props {
    metrics: Array<{
      value: number | string;
      format?: 'number' | 'currency' | 'duration' | 'date' | 'percentage';
      emoji?: string;
      title: string;
      description?: string;
    } | null>;
    columns?: number;
    locale?: string;
    currency?: string;
  }

  let { metrics, columns, locale = 'de-DE', currency = 'EUR' }: Props = $props();

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  function formatDuration(minutes: number): string {
    const wholeHours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${wholeHours}h ${mins}m`;
  }

  function formatDate(value: string | number): string {
    return new Date(value).toLocaleDateString(locale);
  }

  function formatValue(metric: NonNullable<(typeof metrics)[number]>): string {
    switch (metric.format) {
      case 'currency': return formatCurrency(Number(metric.value));
      case 'duration': return formatDuration(Number(metric.value));
      case 'date': return formatDate(metric.value);
      case 'percentage': return `${metric.value}%`;
      default: return metric.value.toString();
    }
  }

  const colsMap: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  };

  const gridClass = $derived(
    columns
      ? `grid gap-6 grid-cols-1 sm:grid-cols-2 ${colsMap[columns] || 'lg:grid-cols-3'}`
      : 'grid gap-6 md:grid-cols-3'
  );
</script>

<div class={gridClass}>
  {#each metrics as metric, i (i)}
    {#if metric !== null}
      <MetricCard
        icon={metric.emoji}
        title={metric.title}
        description={metric.description}
        value={formatValue(metric)}
      />
    {/if}
  {/each}
</div>
