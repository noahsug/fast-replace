#!/usr/bin/env node
const updateNotifier = require('update-notifier');

const fastReplace = require('./fastReplace');
const parseArgs = require('./parseArgs');
const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

const { from, to, options } = parseArgs();
fastReplace(from, to, options).catch((e) => console.log(e));
