const {readdir} = require('fs/promises');
const path = require('path');
const {stat} = require('fs');
const {stdout} = process;

async function read(pathDir) {
  try {
    const files = await readdir(pathDir, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const [name, extension] = file.name.split('.');
        stat(path.join(pathDir, file.name), (err, stats) => {
          if (err) throw err;
          stdout.write(`${name} - ${extension} - ${stats.size} bytes\n`);
        });
      }  
    }
  } catch (err) {
    stdout.write(err.message);
  }
}
read(path.join(__dirname, 'secret-folder'));
