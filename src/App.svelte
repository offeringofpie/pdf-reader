<script>
  import Header from './components/Header.svelte';
  import Reader from './components/Reader.svelte';
  import Footer from './components/Footer.svelte';
</script>

<svelte:head>
  <meta
    name="description"
    content="Web site created using create-snowpack-app"
  />
  <title>A New Title</title>
</svelte:head>

<slot>
  <Header />
  <Reader />
  <Footer />
</slot>
