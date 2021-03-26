/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: { url: '/' },
    // Mount "public" to the root URL path ("/*") and serve files with zero transformations
    public: { url: '/' },
  },
  plugins: [
    [
      '@snowpack/plugin-build-script',
      {
        cmd: 'postcss',
        input: ['.css', '.pcss'],
        output: ['.css'],
      },
    ],
    [
      '@snowpack/plugin-svelte',
      {
        compilerOptions: {
          hydratable: true,
          css: false,
          cssHash: ({ hash, css, name, filename }) => {
            return `${hash(name)}`;
          },
        },
      },
    ],
  ],
  packageOptions: {},
  devOptions: {},
  buildOptions: {},
  alias: {},
  optimize: {
    bundle: true,
    minify: true,
    manifest: true,
    sourcemap: false,
    target: 'es2020',
  },
};
