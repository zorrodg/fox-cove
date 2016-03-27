'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;

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
        assert.equal('Logged: \'This is a new message\'', output.trim());
      })
      .done(done);
  });
});
