const {mkdir, copyFile, readdir, rm} = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');
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
    console.error(err);
  }
}

(async function () {
    await rm(copyDirPath, { recursive: true, force: true });
    await mkdir(copyDirPath, {recursive: true});
    createDir(dirPath, copyDirPath);
  })();