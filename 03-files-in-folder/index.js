const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (file.isFile()) {
      const filename = file.name;
      const extension = path.extname(filename);
      const filepath = path.join(folderPath, filename);

      fs.stat(filepath, (err, stats) => {
        if (err) throw err;

        const sizeInBytes = stats.size;
        const sizeInKilobytes = (sizeInBytes / 1024).toFixed(3);

        console.log(`${filename} - ${extension.slice(1)} - ${sizeInKilobytes}kb`);
      });
    }
  });
});
