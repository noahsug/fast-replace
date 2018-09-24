#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs');

const fastReplace = require('./fastReplace');

const cliOptions = {};

argv = yargs
  .command('$0 <from> <to> [paths...]')
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
  })
  .help().argv;

const { from, to, ...options } = argv;

fastReplace(from, to, options);
