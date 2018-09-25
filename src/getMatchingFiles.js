const rg = require('./ripgrep');

module.exports = function getMatchingFiles(args, onFile) {
  const thread = rg(args.concat('-l'), { stdio: [process.stdin, 'pipe'] });
  const files = [];
  thread.stdout.on('data', data => {
    files.push(
      ...data
        .toString()
        .trim()
        .split('\n')
    );
  });
  return new Promise(resolve => thread.on('exit', () => resolve(files)));
};
