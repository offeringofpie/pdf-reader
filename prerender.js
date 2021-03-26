const { existsSync, promises } = require('fs');
const { join } = require('path');
require('svelte/register')({
  cssHash: ({ hash, css, name, filename }) => {
    return `${hash(css)}`;
  },
});

const App = require('./src/App.svelte').default;

async function main() {
  const templatePath = join(process.cwd(), 'src', 'template.html');
  const publicPath = join(process.cwd(), 'public');

  const template = await promises.readFile(templatePath);
  const app = App.render();

  if (!existsSync(publicPath)) {
    await promises.mkdir(publicPath);
  }

  await promises.writeFile(
    join(publicPath, 'index.html'),
    template
      .toString()
      .replace('%svelte.head%', app.head)
      .replace('%svelte.html%', app.html)
  );
}

main();
