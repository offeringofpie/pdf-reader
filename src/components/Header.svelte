<script>
  import { onMount } from 'svelte';
  import {
    doc,
    pageNum,
    numPages,
    fileInput,
    settings_show,
  } from '../store.js';
  import Button from './Button.svelte';
  import Settings from './Settings.svelte';

  export let prev;
  export let next;
  export let zoom;
  export let zoomIn;
  export let zoomOut;

  function toggleSettings() {
    settings_show.set(!$settings_show);
  }

  function selectFile() {
    $fileInput.click();
  }

  function handleKeydown(ev) {
    switch (ev.keyCode) {
      case 37: //right
        prev();
        break;
      case 39: //left
        next();
        break;
      case 61: // +
        zoomIn();
        break;
      case 173: // -
        zoomOut();
        break;
      case 79: // o
        selectFile();
        break;
      case 191: // ?
        settings_show.update((val) => !val);
        break;
      default:
        break;
    }
  }

  onMount(() => {});
</script>

<svelte:window on:keydown={handleKeydown} />

<header
  class="fixed flex top-0 w-screen justify-between items-center flex-row text-center shadow-lg bg-gray-600 text-gray-400 p-3 z-10"
>
  <nav>
    <Button icon="folder" on:click={selectFile} />
  </nav>
  {#if $doc}
    <div class="flex">
      <Button icon="chevronLeft" on:click={prev} />
      <div>{$pageNum} of {$numPages}</div>
      <Button icon="chevronRight" on:click={next} />
    </div>
  {/if}

  <nav class="flex">
    <Button
      icon="cog"
      on:click={toggleSettings}
      className={$settings_show ? 'transform rotate-90' : ''}
    />
  </nav>
  <Settings {zoom} />
</header>
