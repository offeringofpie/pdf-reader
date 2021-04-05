<script>
  import { doc, canvas, textElem, pageContent } from './store.js';
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import Sprite from './components/Sprite.svelte';
  import Drop from './components/Drop.svelte';
  import Reader from './classes/Reader.ts';

  const reader = new Reader();

  let canvasElem, textContainer;

  let dragging = false;

  function startDragging() {
    dragging = true;
  }

  function stopDragging() {
    dragging = false;
  }

  onMount(() => {
    canvas.update((val) => canvasElem);
    textElem.update((val) => textContainer);
    reader.init();
  });

  function touchmove(ev) {
    console.log(ev);
  }
</script>

<slot>
  <Header {...reader} />
  <main
    class="relative mx-auto min-h-screen overflow-auto"
    on:dragover|preventDefault={startDragging}
    on:dragleave|preventDefault={stopDragging}
    on:drop|preventDefault={stopDragging}
  >
    <Drop {...reader} className={``} {dragging} />
    <div class="pt-20">
      <!-- svelte-ignore component-name-lowercase -->
      <canvas
        bind:this={canvasElem}
        on:touchmove={touchmove}
        class={`mx-auto shadow-xl relative z-0 ${$doc ? '' : 'hidden'}`}
      />
      <div
        bind:this={textContainer}
        class="text-container absolute left-0 top-0 right-0 bottom-0 overflow-hidden opacity-80 z-0"
      />
    </div>
  </main>
  {#if $pageContent}
    <Footer />
  {/if}
  <Sprite />
</slot>

<style>
  :global(.text-container) {
    line-height: 1;
  }

  :global(.text-container > span) {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }
</style>
