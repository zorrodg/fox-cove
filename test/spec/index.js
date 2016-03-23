'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var Q = require('q');
var path = require('path');
var readFile = Q.denodeify(require('fs').readFile);
var splitInPairs = require('./../../lib/util/log-handle').splitInPairs;

describe('Entry command', function () {
  it('shoud output error message when no msg is set', function (done) {
    runProcess('fxc')
      .then(function (output) {
        assert.equal(output, 'No message provided. Please provide a message to log.\n');
      })
      .done(done);
  });

  it('should log a message', function (done) {
    runProcess('fxc', ['This is a new message'])
      .then(function (output) {
        assert(new RegExp('Logged: \'This is a new message\'\n').test(output));
      })
      .done(done);
  });
});

describe('Coffee / Work options', function() {
  it('should log coffee breaks', function (done) {
    runProcess('fxc', ['--coffee'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'---- COFFEE BREAK ----\'\n');
        return readFile(path.resolve('./logs/CURRENT'), 'utf-8');
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
        return runProcess('fxc', ['--work']);
      })
      .then(function (output) {
        var otherVerb = /---- WORK ([A-Z]{4,5}) ----/.exec(output);
        otherVerb = otherVerb && otherVerb[1];

        assert.ok(otherVerb);
        assert.ok(verb !== otherVerb);
        return readFile(path.resolve('./logs/CURRENT'), 'utf-8');
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