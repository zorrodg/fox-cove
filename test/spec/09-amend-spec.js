'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var resolve = require('path').resolve;
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var CONFIG_PATH = require('./../../package.json').CONFIG_PATH;
var splitInPairs, config;

describe('Amend option', function() {
  beforeEach(function () {
    config = config || require(resolve(CONFIG_PATH));
     splitInPairs = require('./../../lib/util/formats/' + config.FORMAT).splitInPairs;
  });

  afterEach(function () {
    config = undefined;
  });

  it('should be able to edit the last entry', function (done) {
    runProcess('fxc', ['First log'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'First log\'\n');
        return runProcess('fxc', ['--amend', 'Second log']);
      })
      .then(function(output) {
        assert.equal(output, 'Edited last entry: \'Second log\'\n');
        return readFile(resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][1], 'Second log');
      })
      .done(done);
  });

  it('should be able to edit the last entry of the chosen option', function (done) {
    var opts = ['--goal', '--idea', '--todo'];
    var selectedOpt = opts[Math.floor(Math.random() * opts.length)];
    var selected = selectedOpt.replace(/-/g, '').toUpperCase();

    runProcess('fxc', [selectedOpt, 'First log'])
      .then(function (output) {
        var regex = new RegExp('Logged: \'\\[' + selected + '(?: #\\d+)?\\]: First log\'');

        assert.ok(regex.test(output), 'First regex');
        return runProcess('fxc', ['Third log']);
      })
      .then(function () {
        return runProcess('fxc', ['-a', selectedOpt, 'Second log']);
      })
      .then(function(output) {
        var regex = new RegExp('Edited last entry: \'\\[' + selected + '(?: #\\d+)?\\]: Second log\'');

        assert.ok(regex.test(output), 'Second regex');
        return readFile(resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        var regex = new RegExp('\\[' + selected + '(?: #\\d+)?\\]: Second log');
        assert.equal(data[data.length - 1][1], 'Third log');
        assert.ok(regex.test(data[data.length - 2][1]), 'Third regex');
      })
      .done(done);
  });

  it('should edit last subgoal', function (done) {
    runProcess('fxc', ['-G', 'Goal'])
      .then(function () {
        return runProcess('fxc', ['-l', 'Subgoal 1']);
      })
      .then(function () {
        return runProcess('fxc', ['-l', 'Subgoal 2']);
      })
      .then(function () {
        return runProcess('fxc', ['-l', 'Subgoal 3']);
      })
      .then(function () {
        return runProcess('fxc', ['-a', '-l', 'Subgoal edit']);
      })
      .then(function (output) {
        assert.equal(output, 'Edited last entry: \'[#3]: Subgoal edit\'\n');
        return readFile(resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        var goal = data[data.length - 1];
        var subgoal = goal[goal.length - 1];

        assert.equal(subgoal, '[#3]: Subgoal edit');
      })
      .done(done);
  });

  it('shouldn\'t edit lines other than the last line', function (done) {
    runProcess('fxc', ['Line 1'])
      .then(function () {
        return runProcess('fxc', ['Line 2']);
      })
      .then(function () {
        return runProcess('fxc', ['-a', 'Line edit']);
      })
      .then(function (output) {
        assert.equal(output, 'Edited last entry: \'Line edit\'\n');
        return readFile(resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        var line = data[data.length - 2];

        assert.equal(line[1], 'Line 1');
      })
      .done(done);
  });
});
