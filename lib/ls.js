'use strict';

var program = require('commander');
var denodeify = require('q').denodeify;
var fs = denodeify(require('fs'));

program
  .option('-s --shell', 'Displays all the called commands')
  .option('-G --goal', 'Displays current goal with subgoals')
  .option('-h --search', 'Displays all searches done')
  .option('-t --todo', 'Displays all TODOs')
  .option('-i --idea', 'Displays all ideas');

program.parse(process.argv);

console.log("View", program.args);
