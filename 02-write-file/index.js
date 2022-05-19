const {stdin, stdout, exit} = process;
const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'text.txt'), '',
  (err) => {
    if (err) throw err;
    stdout.write('Привет, введи текст:\n');
  }    
);
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'),
    ` ${data}`,
    (err) => {
      if (err) throw err;
    }
  )
});
process.on('exit', () => stdout.write('Выход из программы!'));
process.on('SIGINT', exit);

