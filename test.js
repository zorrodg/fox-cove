var spawn = require('child_process').spawn;
var proc = spawn('fc', ['-ln', '-1']);

proc.stdout.on('data', function (data) {
  console.log(data.toString('utf-8'));
});

proc.stderr.on('data', function (data) {
  console.log('Error: ' + data.toString('utf-8'));
});

proc.on('close', function (code) {
  console.log(code);
});