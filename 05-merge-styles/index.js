const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  const stylesPath = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  let styles = '';
  try {
    const files = await fs.readdir(stylesPath);
    for (const file of files) {
      const filePath = path.join(stylesPath, file);
      const stat = await fs.stat(filePath);
      if (stat.isFile() && path.extname(filePath) === '.css') {
        const content = await fs.readFile(filePath, 'utf-8');
        styles += content + '\n';
      }
    }
    await fs.writeFile(bundlePath, styles);
  } catch (err) {
    console.error(err);
  }
}

mergeStyles();
