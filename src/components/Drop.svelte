<script>
  import { onMount } from 'svelte';
  import { doc, fileInput } from '../store';
  export let open;
  export let className;
  export let dragging = false;

  let inputElement;

  function getFilesFromDropEvent({ dataTransfer: { files, items } }) {
    return files.length
      ? [...files]
      : items
          .filter(({ kind }) => kind === 'file')
          .map(({ getAsFile }) => getAsFile());
  }

  function getFilesFromInputEvent({ target }) {
    const files = target.files ? [...target.files] : [];
    target.value = '';
    return files;
  }

  const onFile = (getFilesFunction) => (event) => {
    const files = getFilesFunction(event);
    if (files.length) {
      open(files[0]);
    }
  };

  function checkDialog(ev) {
    if ($doc && ev.clientY > 0) {
      ev.preventDefault();
    }
  }

  onMount(() => {
    fileInput.update((val) => inputElement);
  });
</script>

<label
  class={`absolute top-20 left-6 bottom-6 right-6 text-center transition-all ease-in-out duration-200 border-4 border-dashed border-transparent rounded-xl z-1 ml-0 ${
    dragging ? 'z-10 border-purple-600 opacity-100' : ''
  } ${$doc ? 'opacity-0' : 'cursor-pointer'} ${className}`}
  on:drop|preventDefault={onFile(getFilesFromDropEvent)}
>
  <slot {dragging} />
  <div
    class="absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
  >
    <svg width="450" height="450" class="max-w-full">
      <use xlink:href="#logo" />
    </svg>
  </div>
  <input
    bind:this={inputElement}
    type="file"
    on:click={checkDialog}
    on:input={onFile(getFilesFromInputEvent)}
    class="hidden"
    accept="application/pdf"
  />
</label>
