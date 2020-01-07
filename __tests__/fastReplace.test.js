const fs = require('fs');

const testFs = require('./testFs');
const fastReplace = require('../src/fastReplace');

beforeEach(() => {
  testFs.create({
    mockDir: {
      f1: 'banana',
      f2: 'Apple',
      f3: 'ignored',
      '.gitignore': 'f3',
    },
  });
});

afterEach(() => {
  testFs.reset();
});

it('finds and replaces text', () => {
  return fastReplace('a', 'z', { quiet: true, paths: ['mockDir'] }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('bznznz');
    expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('Apple');
  });
});

it('finds and replaces regex', () => {
  return fastReplace('([A-Z])([a-z]+)e', 'e$2$1', {
    quiet: true,
    paths: ['mockDir'],
  }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
    expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('epplA');
  });
});

it('searches hidden files by default', () => {
  return fastReplace('f3', 'f1', { quiet: true, paths: ['mockDir'] }).then(() => {
    expect(fs.readFileSync('mockDir/.gitignore', 'utf8')).toBe('f1');
  });
});

it('respects .gitignore by default', () => {
  return fastReplace('ignored', 'hi', { quiet: true, paths: ['mockDir'] }).then(() => {
    expect(fs.readFileSync('mockDir/f3', 'utf8')).toBe('ignored');
  });
});

it('dryrun does not write changes', () => {
  return fastReplace('a', 'z', {
    quiet: true,
    paths: ['mockDir'],
    dryrun: true,
  }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
    expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('Apple');
  });
});

it('ignoreCase ignores case', () => {
  return fastReplace('a[A-Z]', 'z', {
    quiet: true,
    paths: ['mockDir'],
    ignoreCase: true,
  }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('bzza');
    expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('zple');
  });
});

it('fixedStrings treats pattern as literal string', () => {
  return fastReplace('.*', '', {
    quiet: true,
    paths: ['mockDir'],
    fixedStrings: true,
  }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
  });
});

it('globs includes matching files', () => {
  return fastReplace('.*', '', {
    quiet: true,
    paths: ['mockDir'],
    globs: ['*1', '*3'],
  }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('');
    expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('Apple');
    expect(fs.readFileSync('mockDir/f3', 'utf8')).toBe('');
  });
});

it('ignoreGlobs excludes matching files', () => {
  return fastReplace('.*', '', {
    quiet: true,
    paths: ['mockDir'],
    ignoreGlobs: ['*1'],
  }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
    expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('');
  });
});

it('ignoreLargeFiles ignores files larger than 50KB in size', () => {
  const largeFileContent = new Array(1024 * 50 + 2).join('9');
  const smallFileContent = new Array(5).join('9');
  testFs.create({
    mockDir: {
      f1: largeFileContent,
      f2: smallFileContent,
    },
  });
  return fastReplace('9', '1', {
    quiet: true,
    paths: ['mockDir'],
    ignoreLargeFiles: true,
  }).then(() => {
    expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe(largeFileContent);
    expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('1111');
  });
});
