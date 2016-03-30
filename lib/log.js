'use strict';

var program = require('commander');
var denodeify = require('q').denodeify;
var appendFile = denodeify(require('fs').appendFile);
var resolve = require('path').resolve;
var assign = require('./util/assign');
var amend = require('./util/amend');
var prefixes = require('./util/prefixes');
var defaults = require('./../package.json').defaults;
var CONFIG_PATH = require('./../package.json').CONFIG_PATH;
var config, format;

try {
  config = require(resolve(CONFIG_PATH));
} catch(e) {
  config = {};
}

config = assign(defaults, config);
format = require('./util/formats/' + config.FORMAT).format;

program
  .option('-w --work', 'Toggles status ---- WORK START ---- and --- WORK STOP ----')
  .option('-b --coffee', 'Logs ---- COFFEE BREAK ----')
  .option('-c --shell', 'Logs a shell command. If no arguments passed, log last used command')
  .option('-G --goal', 'Logs current goal')
  .option('-l --subgoal', 'Adds sub goals or specific tasks to the current goal')
  .option('-f --subgoal-finish <i>', 'Marks a subgoal as completed.')
  .option('-s --search', 'Logs a search to internet (defaults to google)')
  .option('-t --todo', 'Logs a TODO')
  .option('-d --done-todo <i>', 'Marks a TODO as completed.')
  .option('-i --idea', 'Logs an idea')
  .option('-a --amend', 'Edit last log entry');

program.parse(process.argv);

var opts = program.opts();
var msg = program.args;

if (opts.amend) {
  amend(msg, opts, config);
} else {
  // Remove options that are not set in the same order as described above
  var selectedOpt = Object.keys(opts).reduce(function (arr, next) {
    if (opts[next]) {
      arr.push(next);
    }

    return arr;
  }, [])[0];

  selectedOpt = selectedOpt || 'default';

  // This is weird. When option, args change positions.
  if (selectedOpt !== 'default') {
    msg.unshift(msg.pop());
  }
  msg = msg.join(' ');
  msg = msg.trim();

  if (msg.length === 0 && !~['shell', 'coffee', 'work', 'doneTodo', 'subgoalFinish'].indexOf(selectedOpt)) {
    console.log('No message provided. Please provide a message to log.');
    process.exit(1);
  }

  msg = (opts.subgoalFinish && typeof opts.subgoalFinish !== 'boolean') ? opts.subgoalFinish : msg;
  msg = (opts.doneTodo && typeof opts.doneTodo !== 'boolean') ? opts.doneTodo : msg;

  prefixes(selectedOpt, msg, config)
    .then(function (message) {
      msg = message;
      // TODO: Test if current file is too big to create a new chunk
      return appendFile(config.LOG_PATH, format(msg, config));
    }).then(function () {
      console.log('Logged: \'' + msg + '\'');
    })
    .catch(function (err) {
      console.error(err);
    });
}
