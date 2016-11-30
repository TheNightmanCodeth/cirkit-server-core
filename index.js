
var server = require('./server.js');
var client = require('./client.js');

function startServer() {
    server.start();
}

function sendPush(msg, ip) {
  client.send(msg, ip);
}

function listDevices() {
  server.getNodes(new function(err, rows) {
    if (err != null) {
      console.log(err)
    } else {
      console.log(rows);
    }
  })
}
