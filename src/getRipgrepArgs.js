module.exports = function getRipgrepArgs(from, options = {}) {
  const {
    paths = [],
    unrestricted,
    ignoreCase,
    fixedStrings,
    globs = [],
    ignoreGlobs = [],
    ignoreLargeFiles,
  } = options;

  // ignore .git/ files
  if (!unrestricted) {
    ignoreGlobs.push('.git');
  }
  const allGlobs = globs.concat(ignoreGlobs.map((g) => `!${g}`));

  return [
    from,
    ...paths,
    unrestricted && '-uu',
    '--hidden', // always include hidden files
    ignoreCase && '-i',
    fixedStrings && '-F',
    ...(ignoreLargeFiles ? ['--max-filesize', '50K'] : []),
    ...allGlobs.map((g) => ['-g', g]),
  ]
    .reduce((flatArr, item) => flatArr.concat(item), []) // flatten
    .filter(Boolean); // remove false-ish
};
