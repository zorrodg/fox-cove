'use strict';

var program = require('commander');
var Q = require('q');
var fs = require('fs');
var resolve = require('path').resolve;
var stat = Q.denodeify(fs.stat);
var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);
var assign = require('./util/assign');

program
  .option('--get', 'Gets configuration property')
  .option('--set', 'Sets a configuration value: Ex: "hello=world". If no value is set, then the property is unset from the config file');

program.parse(process.argv);

var args = program.args;
var opts = program.opts();

// Remove options that are not set in the same order as described above
var selectedOpt = Object.keys(opts).reduce(function (arr, next) {
  if (opts[next]) {
    arr.push(next);
  }

  return arr;
}, [])[0];

if (!args.length) {
  process.exit(1);
}

args = [];

args.push(program.args[0].replace(/=.*$/, ''));
args.push(program.args[0].replace(new RegExp(args[0] + '=?'), ''));

if (args[1] === '') {
  args[1] = undefined;
}

stat(resolve('./fxc.json'))
  .then(function (stat) {
    if (stat.isFile()) {
      return readFile(resolve('./fxc.json'));
    }
  })
  .catch(function () {
    return Q.when(null);
  })
  .then(function (fileContent) {
    fileContent = assign({}, fileContent && JSON.parse(fileContent.toString('utf8')));

    if (selectedOpt === 'get') {
      return fileContent[args[0]];
    }
    if (typeof args[1] !== 'undefined') {
      fileContent[args[0]] = args[1];
    } else {
      delete fileContent[args[0]];
    }
    return writeFile(resolve('./fxc.json'), JSON.stringify(fileContent));
  })
  .then(function (output) {
    if (output) {
      console.log(output);
    } else {
      console.log('Property "' + args[0] + '" ' + (args[1] ? ('set to "' + args[1] + '"') : 'removed'));
    }
    process.exit();
  });

