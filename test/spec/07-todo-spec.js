'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var resolve = require('path').resolve;
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var CONFIG_PATH = require('./../../package.json').CONFIG_PATH;
var splitInPairs, config;

describe('TODO option', function () {
  beforeEach(function () {
    config = config || require(resolve(CONFIG_PATH));
    splitInPairs = require('./../../lib/util/formats/' + config.FORMAT).splitInPairs;
  });

  afterEach(function () {
    config = undefined;
  });

  it('should log a TODO', function (done) {
    runProcess('fxc', ['--todo', 'Test TODO'])
      .then(function (output) {
        assert.ok(/Logged: '\[TODO #\d+\]: Test TODO'/.test(output));
      })
      .done(done);
  });

  it('should log a TODO with consecutive number', function (done) {
    var consecutive;

    runProcess('fxc', ['--todo', 'Test TODO'])
      .then(function (output) {
        consecutive = /Logged: '\[TODO #(\d+)\]: Test TODO'/.exec(output)[1];
        return runProcess('fxc', ['-t', 'Test TODO']);
      })
      .then(function (output) {
        var num = /Logged: '\[TODO #(\d+)\]: Test TODO'/.exec(output)[1];
        assert.equal(num, parseInt(consecutive, 10) + 1);
      })
      .done(done);
  });

  it('should mark a TODO as done, only once', function (done) {
    var consecutive;

    runProcess('fxc', ['--todo', 'Test TODO mark done'])
      .then(function (output) {
        consecutive = /Logged: '\[TODO #(\d+)\]: Test TODO mark done'/.exec(output)[1];
        return runProcess('fxc', ['--done-todo', consecutive]);
      })
      .then(function (output) {
        assert.equal(output, 'TODO #' + consecutive + ' marked as done\n');
        return readFile(resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][1], '[TODO #' + consecutive + ']: -- DONE -- Test TODO mark done');
        return runProcess('fxc', ['--done-todo', consecutive]);
      })
      .then(function (output) {
        assert.equal(output, 'TODO not found. To list all TODOS, use `fxc view -t` command\n');
      })
      .done(done);
  });
});
