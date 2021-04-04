<script>
  export let size = 20;
  export let icon = false;
  export let className = '';
</script>

<button
  on:click
  class={`transition-all ease-in-out duration-200 text-gray-400 hover:text-purple-400 ${className}`}
>
  {#if icon}
    <svg width={size} height={size}>
      <use xlink:href="#{icon}" />
    </svg>
  {/if}
  <slot />
</button>
