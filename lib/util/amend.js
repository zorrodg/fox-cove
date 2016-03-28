'use strict';

var Q = require('q');
var fs = require('fs');
var resolve = require('path').resolve;
var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);
var logHandle = require('./log-handle');
var format;

module.exports = function (msg, opts, config) {
  var regex, logMsg;

  format = require('./formats/' + config.FORMAT);

  msg.unshift(msg.pop());
  msg = msg.join(' ');
  msg = msg.trim();

  opts = Object.keys(opts)
    .reduce(function (arr, next) {
      if (!!~ [
        'goal',
        'subgoal',
        'search',
        'todo',
        'idea'
      ].indexOf(next)) {
        if (opts[next]) {
          arr.push(next.toUpperCase());
        }
      }

      return arr;
    }, []);
  if (opts.length) {
    regex = new RegExp('\\[(?:' + opts.join('|') + ').*\\]: (?!-- DONE --)');
  }

  readFile(resolve(config.LOG_PATH), 'utf-8')
    .then(function (data) {
      var len;
      data = format.splitInPairs(data, true);
      len = data.length;

      if (!!~ opts.indexOf('SUBGOAL')) {
        len = logHandle.getGoalIndex(data);

        data[len][data[len].length - 1] =
          data[len][data[len].length - 1].replace(/\]: (.*)/, ']: ' + msg);

        logMsg = data[len][data[len].length - 1];
      } else if (regex) {
        while(len--) {
          if (regex.test(data[len][1])) {
            break;
          }
        }

        data[len][1] = data[len][1].replace(/\]: (.*)/, ']: ' + msg);
        logMsg = data[len][1];
      } else {
        len--;
        data[len][1] = '  ' + msg;
        logMsg = data[len][1];
      }

      return writeFile(resolve(config.LOG_PATH), format.joinPairs(data));
    })
    .then(function () {
      console.log('Edited last entry: \'' + logMsg.trim() + '\'');
      process.exit();
    })
    .catch(function (err) {
      console.log(err);
    });
};
