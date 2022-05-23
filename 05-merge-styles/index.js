const {readdir} = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function bundleCss(stylesPath, bundlePath) {
  const files = await readdir(stylesPath, {withFileTypes: true});
  let arr = [];
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const styles = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      for await (const style of styles) {
        arr.push(style);
      }
      const bundle = fs.createWriteStream(bundlePath);
      bundle.write(arr.join('\n'));
    }
  }
}
bundleCss(path.join(__dirname, 'styles'),
       path.join(__dirname, 'project-dist', 'bundle.css'));