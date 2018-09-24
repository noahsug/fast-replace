const fs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');

const streamMatchingFiles = require('./streamMatchingFiles');
const printReplacements = require('./printReplacements');

function replace(file, from, to) {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(from, to);
  fs.writeFileSync(file, newContent, 'utf8');
}

function getRegex(str, { ignoreCase, fixedStrings } = {}) {
  const flags = ignoreCase ? 'gi' : 'g';
  const regexStr = fixedStrings ? escapeStringRegexp(str) : str;
  return new RegExp(regexStr, flags);
}

function reduceFlatten(arr, current) {
  return arr.concat(current);
}

function getRipgrepArgs(from, options = {}) {
  const {
    paths = [],
    unrestricted,
    ignoreCase,
    fixedStrings,
    globs = [],
    ignoreGlobs = [],
  } = options;

  const allGlobs = globs.concat(ignoreGlobs.map(g => '!' + g));

  return [
    from,
    ...paths,
    unrestricted && '-uu',
    '--hidden', // include hidden files
    ignoreCase && '-i',
    fixedStrings && '-F',
    allGlobs.length > 0 && ['-g', ...allGlobs],
  ]
    .reduce(reduceFlatten, [])
    .filter(Boolean);
}

module.exports = function fastReplace(from, to, options) {
  const regex = getRegex(from, options);
  const rgArgs = getRipgrepArgs(from, options);

  const resolving = [];
  if (!options.dryrun) {
    resolving.push(streamMatchingFiles(rgArgs, file => replace(file, regex, to)));
  }
  if (!options.quiet) {
    resolving.push(printReplacements(rgArgs, to));
  }
  return Promise.all(resolving);
};
