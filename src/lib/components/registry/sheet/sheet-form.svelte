<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import type { Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import { t } from '$lib/stores/i18nStore';
	import type { Side } from '$lib/components/ui/sheet/sheet-content.svelte';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		error?: string;
		isLoading?: boolean;
		submitLabel?: string;
		submittingLabel?: string;
		cancelLabel?: string;
		closeLabel?: string;
		side?: Side;
		maxWidth?: string;
		onOpenChange?: (open: boolean) => void;
		onSubmit: (e: SubmitEvent) => void;
		children: Snippet;
		/** Optional snippet rendered after the error alert and before the children (sections). */
		header?: Snippet;
		/** Optional snippet to replace the default footer buttons. */
		footer?: Snippet;
	}

	let {
		open = $bindable(),
		title,
		description,
		error,
		isLoading = false,
		submitLabel = $t.common.save,
		submittingLabel = $t.common.saving,
		cancelLabel = $t.common.cancel,
		closeLabel = $t.common.close,
		side = 'right',
		maxWidth = 'data-[side=left]:sm:max-w-lg data-[side=right]:sm:max-w-lg',
		onOpenChange,
		onSubmit,
		children,
		header,
		footer
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

		<form onsubmit={onSubmit} class="flex flex-1 flex-col overflow-hidden">
			<div class="flex-1 space-y-6 overflow-y-auto px-4 py-6">
				{#if error}
					<Alert.Root variant="destructive">
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}

				{#if header}
					{@render header()}
				{/if}

				{@render children()}
			</div>

			<div class="sticky bottom-0 z-10 border-t bg-muted px-4 py-4">
				{#if footer}
					{@render footer()}
				{:else}
					<div class="flex justify-end gap-2">
						<Button
							type="button"
							size="lg"
							variant="outline"
							onclick={() => (open = false)}
							disabled={isLoading}
						>
							{cancelLabel}
						</Button>
						<Button size="lg" type="submit" disabled={isLoading}>
							{isLoading ? submittingLabel : submitLabel}
						</Button>
					</div>
				{/if}
			</div>
		</form>
	</Sheet.Content>
</Sheet.Root>
