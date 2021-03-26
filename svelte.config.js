const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  preprocess: sveltePreprocess({
    defaults: {
      style: 'postcss',
    },
    postcss: {
      plugins: [
        require('postcss-nested'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  }),
};
