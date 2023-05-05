const fs = require('fs');
const readline = require('readline');
const path = require('path'); 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = path.join(__dirname, 'text.txt');
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Добро пожаловать! Введите текст (для выхода введите exit):');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Выход из программы...До свидания!');
    process.exit();
  }
  fileStream.write(input + '\n');
});

rl.on('SIGINT', () => {
  process.emit('SIGINT');
});

process.on('SIGINT', () => {
  console.log('Выход из программы...До свидания!');
  fileStream.end();
  process.exit();
});