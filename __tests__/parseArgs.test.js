/* eslint-disable global-require */

let oldArgv;

beforeEach(() => {
  oldArgv = process.argv;
});

afterEach(() => {
  process.argv = oldArgv;
  jest.resetModules();
});

function parseArgs(...args) {
  process.argv = [process.argv[0], process.argv[1], ...args];
  return require('../src/parseArgs')();
}

it('parses simple process.argv arguments', () => {
  expect(parseArgs('from', 'to')).toEqual({
    from: 'from',
    to: 'to',
    options: expect.objectContaining({
      paths: [],
    }),
  });
});

it('parses complex process.argv arguments', () => {
  expect(
    parseArgs(
      'from',
      'to',
      'path1',
      'path2',
      '--dryrun',
      '--quiet',
      '--unrestricted',
      '--ignoreCase',
      '--fixedStrings',
      '--globs',
      'glob1',
      'glob2',
      '--ignoreGlobs',
      'ignoreGlob1',
      'ignoreGlob2',
      '--ignoreLargeFiles',
    ),
  ).toEqual({
    from: 'from',
    to: 'to',
    options: expect.objectContaining({
      paths: ['path1', 'path2'],
      dryrun: true,
      quiet: true,
      unrestricted: true,
      ignoreCase: true,
      globs: ['glob1', 'glob2'],
      ignoreGlobs: ['ignoreGlob1', 'ignoreGlob2'],
      ignoreLargeFiles: true,
    }),
  });
});

it('parses nested quotes', () => {
  expect(parseArgs("'from'", 'to')).toEqual({
    from: "'from'",
    to: 'to',
    options: expect.objectContaining({
      paths: [],
    }),
  });
});
