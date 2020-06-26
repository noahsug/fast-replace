const fs = require('fs');

const testFs = require('./testFs');
const fastReplace = require('../src/fastReplace');

beforeEach(() => {
  testFs.enter({
    f1: 'banana',
    f2: 'Apple',
    f3: 'ignored',
    f4: `some 'quotes'`,
    '.gitignore': 'f3',
    '.git/HEAD': 'ref: refs/heads/master',
  });
});

afterEach(() => {
  testFs.exit();
});

it('finds and replaces text', async () => {
  await fastReplace('a', 'z', { quiet: true });

  expect(fs.readFileSync('f1', 'utf8')).toBe('bznznz');
  expect(fs.readFileSync('f2', 'utf8')).toBe('Apple');
});

it('finds and replaces regex', async () => {
  await fastReplace('([A-Z])([a-z]+)e', 'e$2$1', {
    quiet: true,
  });

  expect(fs.readFileSync('f1', 'utf8')).toBe('banana');
  expect(fs.readFileSync('f2', 'utf8')).toBe('epplA');
});

it('searches hidden files by default', async () => {
  await fastReplace('f3', 'f1', { quiet: true });

  expect(fs.readFileSync('.gitignore', 'utf8')).toBe('f1');
});

it('respects .gitignore by default', async () => {
  await fastReplace('ignored', 'hi', { quiet: true });

  expect(fs.readFileSync('f3', 'utf8')).toBe('ignored');
});

it('dryrun does not write changes', async () => {
  await fastReplace('a', 'z', {
    quiet: true,
    dryrun: true,
  });

  expect(fs.readFileSync('f1', 'utf8')).toBe('banana');
  expect(fs.readFileSync('f2', 'utf8')).toBe('Apple');
});

it('ignoreCase ignores case', async () => {
  await fastReplace('a[A-Z]', 'z', {
    quiet: true,
    ignoreCase: true,
  });

  expect(fs.readFileSync('f1', 'utf8')).toBe('bzza');
  expect(fs.readFileSync('f2', 'utf8')).toBe('zple');
});

it('fixedStrings treats pattern as literal string', async () => {
  await fastReplace('.*', '', {
    quiet: true,
    fixedStrings: true,
  });

  expect(fs.readFileSync('f1', 'utf8')).toBe('banana');
});

it('globs includes matching files', async () => {
  await fastReplace('.*', '', {
    quiet: true,
    globs: ['*1', '*3'],
  });

  expect(fs.readFileSync('f1', 'utf8')).toBe('');
  expect(fs.readFileSync('f2', 'utf8')).toBe('Apple');
  expect(fs.readFileSync('f3', 'utf8')).toBe('');
});

it('ignoreGlobs excludes matching files', async () => {
  await fastReplace('.*', '', {
    quiet: true,
    ignoreGlobs: ['*1'],
  });

  expect(fs.readFileSync('f1', 'utf8')).toBe('banana');
  expect(fs.readFileSync('f2', 'utf8')).toBe('');
});

it('ignoreLargeFiles ignores files larger than 50KB in size', async () => {
  const largeFileContent = new Array(1024 * 50 + 2).join('9');
  const smallFileContent = new Array(5).join('9');
  testFs.enter({
    f1: largeFileContent,
    f2: smallFileContent,
  });

  await fastReplace('9', '1', {
    quiet: true,
    ignoreLargeFiles: true,
  });

  expect(fs.readFileSync('f1', 'utf8')).toBe(largeFileContent);
  expect(fs.readFileSync('f2', 'utf8')).toBe('1111');
});

it('finds and replaces text', async () => {
  testFs.enter({
    'dir1/f1': 'banana',
    'dir2/f2': 'banana',
    'dir3/f3': 'banana',
    'dir4/f4': 'banana',
  });

  await fastReplace('a', 'z', { quiet: true, paths: ['dir1', 'dir3'] });

  expect(fs.readFileSync('dir1/f1', 'utf8')).toBe('bznznz');
  expect(fs.readFileSync('dir2/f2', 'utf8')).toBe('banana');
  expect(fs.readFileSync('dir3/f3', 'utf8')).toBe('bznznz');
  expect(fs.readFileSync('dir4/f4', 'utf8')).toBe('banana');
});
