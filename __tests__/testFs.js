const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const tmp = require('tmp');

const { name: root } = tmp.dirSync();
const originalCwd = process.cwd();

function enter(fsObj) {
  rimraf.sync(root);
  mkdirp.sync(root);
  process.chdir(root);
  recursiveCreate(fsObj);
}

function exit() {
  process.chdir(originalCwd);
}

function recursiveCreate(fsObj = {}, dir = '') {
  Object.keys(fsObj).forEach((dirOrFile) => {
    const content = fsObj[dirOrFile];
    const nextDir = path.join(dir, dirOrFile);
    if (typeof content === 'string') {
      mkdirp.sync(path.dirname(nextDir));
      fs.writeFileSync(nextDir, content);
    } else {
      recursiveCreate(content, nextDir);
    }
  });
}

module.exports = { enter, exit, root };
