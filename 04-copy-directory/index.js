const fs = require('fs').promises;
const path = require('path');

async function copyDirectory() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(destDir, { recursive: true });
  } catch (err) {
    console.error(`Error creating destination directory: ${err}`);
    return;
  }

  let files;
  try {
    files = await fs.readdir(sourceDir);
  } catch (err) {
    console.error(`Error reading source directory: ${err}`);
    return;
  }

  try {
    const destFiles = await fs.readdir(destDir);
    for (let file of destFiles) {
      await fs.unlink(path.join(destDir, file));
    }
  } catch (err) {
    console.error(`Error removing files from destination directory: ${err}`);
    return;
  }

  for (let file of files) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    try {
      const stats = await fs.stat(srcPath);
      if (stats.isDirectory()) {
        await copyDirectoryRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    } catch (err) {
      console.error(`Error copying file ${file}: ${err}`);
      return;
    }
  }

  console.log('Copy successful!');
}

copyDirectory();

