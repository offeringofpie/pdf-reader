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

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#ffffff" />
  <meta
    name="description"
    content="Web site created using create-snowpack-app"
  />
  <title>The Reader</title>
</svelte:head>

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
