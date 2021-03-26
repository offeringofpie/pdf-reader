import App from './App.svelte';
import './main.css';

var app = new App({
  target: document.body,
  hydrate: true,
});

export default app;

async function main() {
  const templatePath = join(process.cwd(), 'index.html');
  const publicPath = join(process.cwd(), '../', 'public');

  const template = await fs.readFile(templatePath);
  const app = App.render();

  if (!existsSync(publicPath)) {
    await fs.mkdir(publicPath);
  }

  await fs.writeFile(
    join(publicPath, 'index.html'),
    template
      .toString()
      .replace('%svelte.head%', app.head)
      .replace('%svelte.html%', app.html)
  );
}

main();

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
}
