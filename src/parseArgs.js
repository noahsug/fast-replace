const yargs = require('yargs');

// Yargs interprets "'arg'" as "arg", so we need to re-escape nested strings.
function fixQuotes(arg) {
  const fixed = `'${arg}'`;
  if (process.argv.includes(fixed)) {
    return fixed;
  }
  return arg;
}

module.exports = function parseArgs() {
  const { argv } = yargs
    .command('$0 <from> <to> [paths...]', 'recursively find and replace regex', (cmd) => {
      cmd
        .positional('from', {
          describe: 'Regex pattern to match',
          type: 'string',
        })
        .positional('to', {
          describe: 'String to replace matched pattern, use $1, $2, etc to match regex groups',
          type: 'string',
        })
        .positional('paths', {
          describe: 'Directories or files to recursively search',
          type: 'array',
        });
    })
    .options({
      dryrun: {
        alias: 'D',
        type: 'boolean',
        describe: 'print replacements without making changes',
      },
      quiet: {
        alias: 'q',
        type: 'boolean',
        describe: 'shhh',
      },
      unrestricted: {
        alias: 'u',
        type: 'boolean',
        describe: `don't respect .gitignore`,
      },
      ignoreCase: {
        alias: 'i',
        type: 'boolean',
        describe: `search with case insensitively`,
      },
      fixedStrings: {
        alias: 'F',
        type: 'boolean',
        describe: `treat pattern as a literal string instead of a regular expression`,
      },
      globs: {
        alias: 'g',
        type: 'array',
        describe: `include files / directories matching the given glob`,
      },
      ignoreGlobs: {
        alias: 'G',
        type: 'array',
        describe: `exclude files / directories matching the given glob`,
      },
      ignoreLargeFiles: {
        alias: 'L',
        type: 'boolean',
        describe: `Ignore files larger than 50KB in size`,
      },
    })
    .help();

  const { from, to, ...options } = argv;
  return {
    from: fixQuotes(from),
    to: fixQuotes(to),
    options,
  };
};
