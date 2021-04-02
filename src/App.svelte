<script>
  import { doc, canvas, pageContent } from './store.js';
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
    reader.init();
  });
</script>

<svelte:head>
  <meta
    name="description"
    content="Web site created using create-snowpack-app"
  />
  <title>A New Title</title>
</svelte:head>

<slot>
  <Header {...reader} />
  <main
    class="relative mx-auto h-screen pt-20 pb-3 flex justify-center"
    on:dragover|preventDefault={startDragging}
    on:dragleave|preventDefault={stopDragging}
    on:drop|preventDefault={stopDragging}
  >
    <div bind:this={textContainer} class="absolute hidden">{$pageContent}</div>
    <Drop {...reader} className={``} {dragging} />
    <!-- svelte-ignore component-name-lowercase -->
    <canvas
      bind:this={canvasElem}
      class={`mx-auto shadow-xl relative z-1 ${$doc ? '' : 'hidden'}`}
    />
  </main>
  {#if $pageContent}
    <Footer />
  {/if}
  <Sprite />
</slot>
