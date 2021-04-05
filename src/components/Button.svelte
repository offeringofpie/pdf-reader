<script>
  export let size = 20;
  export let icon = false;
  export let className = '';
  export let label = 'button';
</script>

<button
  on:click
  class={`transition-all ease-in-out duration-200 text-gray-400 hover:text-purple-400 ${className}`}
  role="button"
  aria-label={label}
>
  {#if icon}
    <svg width={size} height={size}>
      <use xlink:href="#{icon}" />
    </svg>
  {/if}
  <slot />
</button>
