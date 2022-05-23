const fs = require('fs');
const path = require('path');
const {stdout} = process;
const {readdir, copyFile, rm, mkdir} = require('fs/promises');

async function insertHtml() {
  let dataHtml = '';
  const components = await readdir(path.join(__dirname, 'components'), {withFileTypes: true});
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  readStream.on('data', chunk => dataHtml += chunk);
  readStream.on('end', () => {
      for (const component of components) {
        if (component.isFile() && path.extname(path.join(__dirname, 'components', component.name)) === '.html') {
          const readComponent = fs.createReadStream(path.join(__dirname, 'components', component.name), 'utf-8');
          const templateName = component.name.slice(0, -5);
          let componentHtml = {};
          readComponent.on('data', chunk => componentHtml[templateName] = chunk);
          readComponent.on('end', () => {
            dataHtml = dataHtml.replace(`{{${templateName}}}`, componentHtml[templateName]);
            const index = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
            index.write(dataHtml);
          })
        }
      }
  });
}

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

async function createDir(dir, copyDir) {
  try {
    const files = await readdir(dir, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.join(dir, file.name), path.join(copyDir, file.name));
      } else if (file.isDirectory()) {
        await mkdir(path.join(copyDir, file.name));
        await createDir(path.join(dir, file.name), path.join(copyDir, file.name));
      }
    }
  } catch (err) {
    stdout.write(err.message);
  }
}

(async function () {
  await rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true });
  await mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
  await mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true});
  insertHtml();
  bundleCss(path.join(__dirname, 'styles'),
         path.join(__dirname, 'project-dist', 'style.css'));
  createDir(path.join(__dirname, 'assets'),
         path.join(__dirname, 'project-dist', 'assets'));
})();