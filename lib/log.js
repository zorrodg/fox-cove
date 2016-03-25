'use strict';

var program = require('commander');
var denodeify = require('q').denodeify;
var appendFile = denodeify(require('fs').appendFile);
var resolve = require('path').resolve;
var assign = require('./util/assign');
var prefixes = require('./util/prefixes');
var format = require('./util/formats/default');
var defaults = require('./../package.json').defaults;
var config;

try {
  config = require(resolve(defaults.CONFIG_PATH));
} catch(e) {
  config = {};
}

config = assign(defaults, config);

program
  .option('-w --work', 'Toggles status ---- WORK START ---- and --- WORK STOP ----')
  .option('-b --coffee', 'Logs ---- COFFEE BREAK ----')
  .option('-s --shell', 'Logs a shell command. If no arguments passed, log last used command')
  .option('-G --goal', 'Logs current goal')
  .option('-l --subgoal', 'Adds sub goals or specific tasks to the current goal')
  .option('-f --subgoal-finish', 'Marks a subgoal as completed.')
  .option('-h --search', 'Logs a search to internet (defaults to google)')
  .option('-t --todo', 'Logs a TODO')
  .option('-c --todo-complete', 'Marks a TODO as completed.')
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

prefixes(selectedOpt, msg, config)
  .then(function (message) {
    msg = message;
    // TODO: Test if current file is too big to create a new chunk
    return appendFile(config.LOG_PATH, format(msg));
  }).then(function () {
    console.log('Logged: \'' + msg + '\'');
  })
  .catch(function (err) {
    console.error(err);
  });
