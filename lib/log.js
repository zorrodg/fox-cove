'use strict';

var program = require('commander');
var denodeify = require('q').denodeify;
var appendFile = denodeify(require('fs').appendFile);
var prefixes = require('./util/prefixes');
var format = require('./util/formats/default');
var defaults = require('./../package.json').defaults;

program
  .option('-w --work', 'Toggles status ---- WORK START ---- and --- WORK STOP ----')
  .option('-b --coffee', 'Logs ---- COFFEE BREAK ----')
  .option('-s --shell', 'Logs a shell command. If no arguments passed, log last used command')
  .option('-g --goal', 'Logs current goal')
  .option('-s --subgoal', 'Adds sub goals or specific tasks to the current goal')
  .option('-g --search', 'Logs a search to internet (defaults to google)')
  .option('-t --todo', 'Logs a TODO')
  .option('-i --idea', 'Logs an idea');

program.parse(process.argv);

var opts = program.opts();
var msg = program.args && program.args.join(' ');

// Remove options that are not set in the same order as described above
var selectedOpt = Object.keys(opts).reduce(function (arr, next) {
  if (opts[next]) {
    arr.push(next);
  }

  return arr;
}, [])[0];

selectedOpt = selectedOpt || 'default';
msg = msg.trim();

if (msg.length === 0 && !~['shell', 'coffee', 'work'].indexOf(selectedOpt)) {
  console.log('No message provided. Please provide a message to log.');
  process.exit(1);
}

prefixes(selectedOpt, msg)
  .then(function (message) {
    msg = message;
    // TODO: Test if current file is too big to create a new chunk
    return appendFile(defaults.LOG_PATH, format(msg));
  }).then(function () {
    console.log('Logged: \'' + msg + '\'');
  })
  .catch(function (err) {
    console.error(err);
  });
