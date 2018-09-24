const rg = require('./ripgrep');

module.exports = function printReplacements(args, replacement) {
  const thread = rg(args.concat(['-r', replacement]), { stdio: 'inherit' });
  return new Promise(resolve => thread.on('exit', resolve));
};
