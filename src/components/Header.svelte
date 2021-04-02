<script>
  import { onMount } from 'svelte';
  import { doc, pageNum, numPages } from '../store.js';
  import Button from './Button.svelte';
  import Settings from './Settings.svelte';
  let settings_show = false;

  export let prev;
  export let next;
  export let zoomIn;
  export let zoomOut;

  onMount(() => {});
</script>

<header
  class="fixed flex top-0 w-full justify-between items-center flex-row text-center shadow-lg bg-gray-600 text-gray-400 p-5 z-10"
>
  <nav>
    <input type="file" class="hidden" />
    <Button icon="folder" />
  </nav>
  {#if $doc}
    <div class="flex">
      <Button icon="chevronLeft" onclick={prev} />
      {$pageNum} of {$numPages}
      <Button icon="chevronRight" onclick={next} />
    </div>
  {/if}

  <nav class="flex">
    {#if $doc}
      <Button icon="minus" onclick={zoomOut} />
      <Button icon="plus" onclick={zoomIn} />
    {/if}

    <Button icon="cog" onclick={() => (settings_show = !settings_show)} />
  </nav>
</header>

<Settings bind:show={settings_show} />
