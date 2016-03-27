'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var path = require('path');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var CONFIG_PATH = require('./../../package.json').CONFIG_PATH;
var splitInPairs, config;

describe('Goal / Subgoal options', function () {
  beforeEach(function () {
    config = config || require(path.resolve(CONFIG_PATH));
    splitInPairs = require('./../../lib/util/formats/' + config.FORMAT).splitInPairs;
  });

  afterEach(function () {
    config = undefined;
  });

  it('should log a goal', function (done) {
    runProcess('fxc', ['--goal', 'Test goal'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'[GOAL]: Test goal\'\n');
        return readFile(path.resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][1], '[GOAL]: Test goal');
      })
      .done(done);
  });

  it('should log a subgoal', function (done) {
    runProcess('fxc', ['--subgoal', 'Test subgoal'])
      .then(function (output) {
        assert.equal(output, 'Logged subgoal: \'Test subgoal\'\n');
        return readFile(path.resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][2], '[#1]: Test subgoal');
      })
      .done(done);
  });

  it('should mark a subgoal as done', function (done) {
    runProcess('fxc', ['--subgoal-finish', '1'])
      .then(function (output) {
        assert.equal(output, 'Subgoal #1 marked as done\n');
        return readFile(path.resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][2], '[#1]: -- DONE -- Test subgoal');
      })
      .done(done);
  });

  it('should\'t list again the subgoal marked as done', function (done) {
    runProcess('fxc', ['-f', '1'])
      .then(function (output) {
        assert.equal(output, 'Subgoal ID not found. Check your goals with `fxc view -G` command\n');
      })
      .done(done);
  });

  it('shouldn\'t list subgoals of previous goals', function (done) {
    runProcess('fxc', ['-G', 'Test goal'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'[GOAL]: Test goal\'\n');
        return runProcess('fxc', ['-l', 'Test subgoal']);
      })
      .then(function (output) {
        assert.equal(output, 'Logged subgoal: \'Test subgoal\'\n');
        return runProcess('fxc', ['--goal', 'Test goal']);
      })
      .then(function (output) {
        assert.equal(output, 'Logged: \'[GOAL]: Test goal\'\n');
        return runProcess('fxc', ['-f', '1']);
      })
      .then(function (output) {
        assert.equal(output, 'Subgoal ID not found. Check your goals with `fxc view -G` command\n');
      })
      .done(done);
  });
});
