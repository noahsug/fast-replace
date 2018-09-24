const p = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const rimraf = require('rimraf');

let rootFiles = [];

function recursiveCreate(fsObj, cwd = '') {
  Object.keys(fsObj).forEach(dirOrFile => {
    const content = fsObj[dirOrFile];
    const path = p.join(cwd, dirOrFile);
    if (typeof content === 'string') {
      execSync(`mkdir -p ${p.dirname(path)}`);
      fs.writeFileSync(path, content, 'utf8');
    } else {
      recursiveCreate(content, path);
    }
  });
}

function create(fsObj) {
  reset();
  rootFiles.push(...Object.keys(fsObj));
  recursiveCreate(fsObj);
}

function reset() {
  rootFiles.forEach(f => rimraf.sync(f));
  rootFiles = [];
}

module.exports = { create, reset };
