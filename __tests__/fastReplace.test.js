const fs = require('fs');

const testFs = require('./testFs');
const fastReplace = require('../src/fastReplace');

beforeEach(() => {
  testFs.create({
    mockDir: {
      f1: 'banana',
      f2: 'Apple',
      f3: 'ignored',
      f4: `some 'quotes'`,
      '.gitignore': 'f3',
    },
  });
});

afterEach(() => {
  testFs.reset();
});

it('finds and replaces text', async () => {
  await fastReplace('a', 'z', { quiet: true, paths: ['mockDir'] });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('bznznz');
  expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('Apple');
});

it('finds and replaces regex', async () => {
  await fastReplace('([A-Z])([a-z]+)e', 'e$2$1', {
    quiet: true,
    paths: ['mockDir'],
  });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
  expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('epplA');
});

it('searches hidden files by default', async () => {
  await fastReplace('f3', 'f1', { quiet: true, paths: ['mockDir'] });
  expect(fs.readFileSync('mockDir/.gitignore', 'utf8')).toBe('f1');
});

it('respects .gitignore by default', async () => {
  await fastReplace('ignored', 'hi', { quiet: true, paths: ['mockDir'] });
  expect(fs.readFileSync('mockDir/f3', 'utf8')).toBe('ignored');
});

it('dryrun does not write changes', async () => {
  await fastReplace('a', 'z', {
    quiet: true,
    paths: ['mockDir'],
    dryrun: true,
  });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
  expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('Apple');
});

it('ignoreCase ignores case', async () => {
  await fastReplace('a[A-Z]', 'z', {
    quiet: true,
    paths: ['mockDir'],
    ignoreCase: true,
  });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('bzza');
  expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('zple');
});

it('fixedStrings treats pattern as literal string', async () => {
  await fastReplace('.*', '', {
    quiet: true,
    paths: ['mockDir'],
    fixedStrings: true,
  });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
});

it('globs includes matching files', async () => {
  await fastReplace('.*', '', {
    quiet: true,
    paths: ['mockDir'],
    globs: ['*1', '*3'],
  });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('');
  expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('Apple');
  expect(fs.readFileSync('mockDir/f3', 'utf8')).toBe('');
});

it('ignoreGlobs excludes matching files', async () => {
  await fastReplace('.*', '', {
    quiet: true,
    paths: ['mockDir'],
    ignoreGlobs: ['*1'],
  });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe('banana');
  expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('');
});

it('ignoreLargeFiles ignores files larger than 50KB in size', async () => {
  const largeFileContent = new Array(1024 * 50 + 2).join('9');
  const smallFileContent = new Array(5).join('9');
  testFs.create({
    mockDir: {
      f1: largeFileContent,
      f2: smallFileContent,
    },
  });
  await fastReplace('9', '1', {
    quiet: true,
    paths: ['mockDir'],
    ignoreLargeFiles: true,
  });
  expect(fs.readFileSync('mockDir/f1', 'utf8')).toBe(largeFileContent);
  expect(fs.readFileSync('mockDir/f2', 'utf8')).toBe('1111');
});
