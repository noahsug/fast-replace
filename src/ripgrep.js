const { rgPath } = require('node-ripgrep');
const { spawn } = require('child_process');

module.exports = function ripgrep(args, options) {
  return spawn(rgPath, args, options);
};
