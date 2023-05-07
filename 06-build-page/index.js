const fs = require('fs').promises;
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');


fs.mkdir(distDir, { recursive: true })
  .then(() => {
    return fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  })
  .then((template) => {
    
    const componentNames = template.match(/{{\w+}}/g);
    let resultHtml = template;
    const readComponent = async (componentName) => {
      const componentPath = path.join(componentsDir, `${componentName}.html`);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      resultHtml = resultHtml.replace(`{{${componentName}}}`, componentContent);
    };
    const readComponents = async () => {
      await Promise.all(componentNames.map((componentName) => readComponent(componentName.replace(/[{}]/g, ''))));
      return resultHtml;
    };
    return readComponents();
  })
  .then((resultHtml) => {
    
    return fs.writeFile(path.join(distDir, 'index.html'), resultHtml);
  })
  .then(() => {
    
    return fs.readdir(stylesDir);
  })
  .then((styleFiles) => {
    let resultCss = '';
    const readCssFile = async (file) => {
      if (path.extname(file) === '.css') {
        const cssContent = await fs.readFile(path.join(stylesDir, file), 'utf-8');
        resultCss += cssContent;
      }
    };
    const readCssFiles = async () => {
      await Promise.all(styleFiles.map((file) => readCssFile(file)));
      return resultCss;
    };
    return readCssFiles();
  })
  .then((resultCss) => {
    return fs.writeFile(path.join(distDir, 'style.css'), resultCss);
  })
  .then(() => {

    const copyDirRecursive = async (src, dest) => {
      const entries = await fs.readdir(src, { withFileTypes: true });
      await fs.mkdir(dest, { recursive: true });
      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          await copyDirRecursive(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    };
    return copyDirRecursive(assetsDir, path.join(distDir, 'assets'));
  })
  .then(() => {
    console.log('Build completed successfully!');
  })
  .catch((err) => {
    console.error(err);
  });
