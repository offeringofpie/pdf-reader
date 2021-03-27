<script>
  const message = 'Learn Svelte';
</script>

<footer>
  <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer">
    {message}
  </a>
</footer>

<style>
  footer {
    @apply h-10;
    @apply text-center;
    @apply p-2;
  }

  a {
    @apply text-yellow-500;
  }
  a:hover {
    @apply text-yellow-700;
  }
</style>
