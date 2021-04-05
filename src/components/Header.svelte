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
  export let goToPage;

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
    <Button icon="folder" on:click={selectFile} label="Open" />
  </nav>
  {#if $doc}
    <div class="flex">
      <Button icon="chevronLeft" on:click={prev} label="Previous page" />
      <div>
        <form on:submit|preventDefault={goToPage}>
          <input
            type="number"
            value={$pageNum}
            placeholder="1"
            class="bg-gray-600 text-gray-400 hover:bg-gray-700 focus:bg-gray-700 border-b-2 border-gray-400 focus:border-gray-200 text-center inline w-8 transition-all ease-in-out duration-200"
          />
          <span>of {$numPages}</span>
        </form>
      </div>
      <Button icon="chevronRight" on:click={next} label="Next page" />
    </div>
  {/if}

  <nav class="flex">
    <Button
      icon="cog"
      label="Settings"
      on:click={toggleSettings}
      className={$settings_show ? 'transform rotate-90' : ''}
    />
  </nav>
  <Settings {zoom} />
</header>
