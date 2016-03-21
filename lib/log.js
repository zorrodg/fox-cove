'use strict';

var program = require('commander');
var denodeify = require('q').denodeify;
var fs = denodeify(require('fs'));
var prefixes = require('./utils/prefixes');

program
  .option('-s --shell', 'Logs a shell command. If no arguments passed, log last used command')
  .option('-g --goal', 'Logs current goal')
  .option('-s --subgoal', 'Adds sub goals or specific tasks to the current goal')
  .option('-b --coffee', 'Logs ---- COFFEE BREAK ----')
  .option('-g --search', 'Logs a search to internet (defaults to google)')
  .option('-t --todo', 'Logs a TODO')
  .option('-i --idea', 'Logs an idea');

program.parse(process.argv);

var opts = program.opts();

// Remove options that are not set
opts = Object.keys(opts).reduce(function (obj, next) {
  if (opts[next]) {
    obj[next] = opts[next];
  }

  return obj;
}, {});

if (!opts.coffee && !program.args.length) {
  console.log('No message provided. Please provide a message to log.');
  process.exit(1);
}

