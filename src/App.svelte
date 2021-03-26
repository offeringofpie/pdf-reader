<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
</script>

<svelte:head>
  <meta name="description" content="Web site created using create-snowpack-app" />
  <title>A New Title</title>
</svelte:head>

<slot>
	<Header />
	<Footer />
</slot>




