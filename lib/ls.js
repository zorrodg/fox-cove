'use strict';

var program = require('commander');
var denodeify = require('q').denodeify;
var readFile = denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var defaults = require('./../package.json').defaults;
var assign = require('./util/assign');
var format = require('./util/formats/default');
var CONFIG_PATH = require('./../package.json').CONFIG_PATH;
var config, format, optsHash;

try {
  config = require(resolve(CONFIG_PATH));
} catch(e) {
  config = {};
}

config = assign(defaults, config);
format = require('./util/formats/' + config.FORMAT);
optsHash = {
  shell: "$",
  goal: "GOAL",
  search: "SEARCH",
  todo: "TODO",
  idea: "IDEA"
};

program
  .option('-c --shell', 'Displays all the called commands')
  .option('-G --goal', 'Displays current goal with subgoals')
  .option('-s --search', 'Displays all searches done')
  .option('-t --todo', 'Displays all TODOs')
  .option('-i --idea', 'Displays all ideas')
  .option('-n --number <i>', 'Total of entries displayed', parseInt);

program.parse(process.argv);

var opts = program.opts();
var pageLength = opts.number || config.PAGE_LENGTH;
var filters = Object.keys(optsHash).reduce(function(arr, next) {
  if (opts[next]) {
    arr.push(optsHash[next]);
  }

  return arr;
}, []);

readFile(resolve(config.LOG_PATH), 'utf-8')
  .then(function (data) {
    var output = [], it;
    data = format.splitInPairs(data, true);

    if (filters.length) {
      data = data.filter(function (item) {
        return new RegExp('\\[' + filters.join('|') + '(?: #\d+)?\\]')
          .test(item[1]);
      });
    }

    if (pageLength > 0) {
      while (pageLength) {
        pageLength--;
        it = data.pop();
        if (!it) {
          break;
        }
        output.push(it);
      }
    } else {
      output = data;
    }

    console.log(format.output(output, config));
  });
