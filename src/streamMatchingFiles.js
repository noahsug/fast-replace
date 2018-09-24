const rg = require('./ripgrep');

module.exports = function streamFiles(args, onFile) {
  const thread = rg(args.concat('-l'), { stdio: [process.stdin, 'pipe'] });
  thread.stdout.on('data', data => {
    data
      .toString()
      .trim()
      .split('\n')
      .forEach(onFile);
  });
  return new Promise(resolve => thread.on('exit', resolve));
}
