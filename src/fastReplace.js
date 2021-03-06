const fs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');

const getRipgrepArgs = require('./getRipgrepArgs');
const getMatchingFiles = require('./getMatchingFiles');
const printReplacements = require('./printReplacements');

module.exports = function fastReplace(from, to, options) {
  const regex = getRegex(from, options);
  const rgArgs = getRipgrepArgs(from, options);

  const resolving = [];
  if (!options.dryrun) {
    resolving.push(getMatchingFiles(rgArgs));
  }
  if (!options.quiet) {
    resolving.push(printReplacements(rgArgs, to));
  }

  return Promise.all(resolving).then(([files]) => {
    if (!Array.isArray(files)) return [];

    files.forEach((file) => replace(file, regex, to));
    return files;
  });
};

function getRegex(str, { ignoreCase, fixedStrings } = {}) {
  const flags = ignoreCase ? 'gi' : 'g';
  const regexStr = fixedStrings ? escapeStringRegexp(str) : str;
  return new RegExp(regexStr, flags);
}

function replace(file, from, to) {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(from, to);
  fs.writeFileSync(file, newContent, 'utf8');
}
