<script>
  import { canvas, pageContent } from './store.js';
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import Sprite from './components/Sprite.svelte';
  import Reader from './classes/Reader.ts';

  const reader = new Reader();

  let canvasElem, textContainer;
  let pdf;

  // function buildSVG(viewport, textContent) {
  //   // Building SVG with size of the viewport (for simplicity)
  //   const svg = document.createElementNS(
  //     'http://www.w3.org/2000/svg',
  //     'svg:svg'
  //   );
  //   svg.setAttribute('width', viewport.width + 'px');
  //   svg.setAttribute('height', viewport.height + 'px');
  //   // items are transformed to have 1px font size
  //   svg.setAttribute('font-size', 1);

  //   // processing all items
  //   textContent.items.forEach(function (textItem) {
  //     // we have to take in account viewport transform, which includes scale,
  //     // rotation and Y-axis flip, and not forgetting to flip text.
  //     const tx = pdfjs.Util.transform(
  //       pdfjs.Util.transform(viewport.transform, textItem.transform),
  //       [1, 0, 0, -1, 0, 0]
  //     );
  //     const style = textContent.styles[textItem.fontName];
  //     // adding text element
  //     const text = document.createElementNS(
  //       'http://www.w3.org/2000/svg',
  //       'svg:text'
  //     );
  //     text.setAttribute('transform', 'matrix(' + tx.join(' ') + ')');
  //     text.textContent = textItem.str;
  //     svg.appendChild(text);
  //   });
  //   return svg;
  // }
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
  <main class="relative mx-auto mt-20 mb-5">
    <div bind:this={textContainer} class="absolute hidden">{$pageContent}</div>
    <canvas bind:this={canvasElem} class="mx-auto shadow-xl" />
  </main>
  <Footer />
  <Sprite />
</slot>
