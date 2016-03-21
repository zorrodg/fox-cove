'use strict';

var program = require('commander');
var VERSION = require('./../package.json').version;

program
  .allowUnknownOption()
  .version(VERSION)
  .command('log', 'Logs an event to your worklog (Default command)', { isDefault: true })
  .command('ls [date]', 'Displays logs for given date. If no given date is set, displays logs for today')
  .command('rm-todo [todoId]', 'Adds "complete" status to given TODO ID ' +
    '(so it won\'t show up with ls --todo command)');

program.parse(process.argv);

