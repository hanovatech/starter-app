<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import type { Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import { t } from '$lib/stores/i18nStore';
	import type { Side } from '$lib/components/ui/sheet/sheet-content.svelte';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		side?: Side;
		maxWidth?: string;
		closeLabel?: string;
		onOpenChange?: (open: boolean) => void;
		children: Snippet;
	}

	let {
		open = $bindable(),
		title,
		description,
		side = 'right',
		maxWidth = 'data-[side=left]:sm:max-w-lg data-[side=right]:sm:max-w-lg',
		closeLabel = $t.common.close,
		onOpenChange,
		children
	}: Props = $props();

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		onOpenChange?.(newOpen);
	}
</script>

<Sheet.Root bind:open onOpenChange={handleOpenChange}>
	<Sheet.Content {side} showCloseButton={false} class="flex data-[side=left]:w-full data-[side=right]:w-full flex-col gap-0 overflow-hidden {maxWidth}">
		<Sheet.Header class="sticky top-0 z-10 border-b bg-muted px-4 py-4">
			<div class="flex items-center justify-between gap-2">
				<div class="flex-1 space-y-1">
					<Sheet.Title>{title}</Sheet.Title>
					{#if description}
						<Sheet.Description>{description}</Sheet.Description>
					{/if}
				</div>
				<Sheet.Close class="sm:hidden rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
					<X class="h-5 w-5" />
					<span class="sr-only">{closeLabel}</span>
				</Sheet.Close>
			</div>
		</Sheet.Header>

		<div class="flex-1 space-y-6 overflow-y-auto px-4 py-6">
			{@render children()}
		</div>
	</Sheet.Content>
</Sheet.Root>
