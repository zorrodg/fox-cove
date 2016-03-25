'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var path = require('path');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var splitInPairs = require('./../../lib/util/log-handle').splitInPairs;
var CONFIG_PATH = require('./../../package.json').CONFIG_PATH;
var config;

describe('Coffee / Work options', function() {
  beforeEach(function () {
    config = config || require(path.resolve(CONFIG_PATH));
  });

  afterEach(function () {
    config = undefined;
  });

  it('should log coffee breaks', function (done) {
    runProcess('fxc', ['--coffee'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'---- COFFEE BREAK ----\'\n');
        return readFile(path.resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][1], '---- COFFEE BREAK ----');
      })
      .done(done);
  });
  it('should toggle work message', function (done) {
    var verb;

    runProcess('fxc', ['--work'])
      .then(function (output) {
        verb = /---- WORK ([A-Z]{4,5}) ----/.exec(output);
        verb = verb && verb[1];

        assert.ok(verb);
        return runProcess('fxc', ['-w']);
      })
      .then(function (output) {
        var otherVerb = /---- WORK ([A-Z]{4,5}) ----/.exec(output);
        otherVerb = otherVerb && otherVerb[1];

        assert.ok(otherVerb);
        assert.ok(verb !== otherVerb);
        return readFile(path.resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        var result = [];
        data = splitInPairs(data);
        result.push(data.pop()[1]);
        result.push(data.pop()[1]);

        result = result.filter(function (item) {
          return /---- WORK [A-Z]{4,5} ----/.test(item);
        });

        assert.equal(result.length, 2);
      })
      .done(done);
  });
});