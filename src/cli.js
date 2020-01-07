#!/usr/bin/env node

const yargs = require('yargs');
const updateNotifier = require('update-notifier');

const fastReplace = require('./fastReplace');
const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

const { argv } = yargs
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
  .help();

const { from, to, ...options } = argv;

fastReplace(from, to, options).catch((e) => console.log(e));
