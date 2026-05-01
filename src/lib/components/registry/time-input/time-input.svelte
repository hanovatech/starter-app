<script lang="ts">
  import Input from '$lib/components/ui/input/input.svelte';

  interface Props {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    class?: string;
  }

  let {
    value = $bindable(''),
    placeholder = 'HH:MM',
    disabled = false,
    id,
    class: className = "bg-background",
  }: Props = $props();

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    const el = e.currentTarget;
    const pos = el.selectionStart ?? 0;
    const raw = el.value;
    const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);
    let v = digits;
    if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2);
    el.value = v;
    const newPos =
      !raw.includes(':') && v.includes(':') && pos > 2
        ? pos + 1
        : Math.min(pos, v.length);
    el.setSelectionRange(newPos, newPos);
    value = v;
  }

  function handleBlur(e: FocusEvent & { currentTarget: HTMLInputElement }) {
    const m = e.currentTarget.value.match(/^(\d{1,2}):(\d{2})$/);
    if (m) {
      const h = Math.min(parseInt(m[1]), 23);
      const min = Math.min(parseInt(m[2]), 59);
      value = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
  }
</script>

<Input
  {id}
  type="text"
  inputmode="numeric"
  {placeholder}
  {value}
  {disabled}
  class={className}
  oninput={handleInput}
  onblur={handleBlur}
/>
