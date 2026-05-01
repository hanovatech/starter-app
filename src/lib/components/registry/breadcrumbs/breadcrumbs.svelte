<script lang="ts">
	import { page } from '$app/state';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { buildBreadcrumbs, type DynamicSegmentMapping } from './build-breadcrumbs.js';

	interface Props {
		labels?: Record<string, string>;
		prefixes?: string[];
		dynamicSegments?: Record<string, DynamicSegmentMapping>;
		class?: string;
	}

	let { labels = {}, prefixes = [], dynamicSegments = {}, class: className }: Props = $props();

	const items = $derived(
		buildBreadcrumbs({
			pathname: page.url.pathname,
			data: page.data,
			labels,
			prefixes,
			dynamicSegments
		})
	);
</script>

{#if items.length > 1}
	<nav class={className}>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				{#each items as item, i (item.href)}
					{#if i > 0}
						<Breadcrumb.Separator />
					{/if}
					<Breadcrumb.Item>
						{#if i === items.length - 1}
							<Breadcrumb.Page>{item.label}</Breadcrumb.Page>
						{:else}
							<Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
						{/if}
					</Breadcrumb.Item>
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</nav>
{/if}
