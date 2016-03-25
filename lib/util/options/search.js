'use strict';

var Q = require('q');
var platform = require('os').platform;
var runProcess = require('./../run-process').runProcess;

// TODO: This might fail in some environments. Do extensive testing.
var OS_COMMAND = {
  win32: 'start',
  darwin: 'open',
  linux: 'xdg-open'
};

module.exports = function (str, config) {
  var searchEngine;

  if (/^https?:\/\//.test(config.SEARCH_ENGINE)) {
    searchEngine = config.SEARCH_ENGINE;
  } else if (config.SEARCH_ENGINE_LIST.hasOwnProperty(config.SEARCH_ENGINE)) {
    searchEngine = config.SEARCH_ENGINE_LIST[config.SEARCH_ENGINE];
  } else {
    console.log('Warning: The provided search engine is invalid. Logging the search term only');
    return Q.when('[SEARCH]: ' + str);
  }

  return runProcess(OS_COMMAND[platform()], [searchEngine + str.replace(/\s/g, '+')], config._TESTING)
    .then(function (output) {
      if (output) {
        return Q.when(output);
      }
      return Q.when('[SEARCH]: ' + str);
    });
};
