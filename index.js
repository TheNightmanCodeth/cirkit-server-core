
var server = require('./server.js');
var client = require('./client.js');
//SQLite database
var sqlite3 = require('sqlite3').verbose()
var db      = new sqlite3.Database('db.sqlite3')


switch (process.argv[2]) {
  case 'push':
    msg = process.argv[3];
    dev = process.argv[4];
    console.log(msg);
    db.each("SELECT rowid AS id, ip, name FROM NODES WHERE id=" +dev, function(err, row) {
      sendPush("The game", row.ip);
      console.log(row.ip);
    })
    break;
  case 'devices':
    listDevices();
    break;
  case 'server':
    var task = process.argv[3];
    if (task == 'start') {
      var start = server();
    }
    break;
  case ('help'||'--help'):
    console.log('Cirkit CLI client----------');
    console.log('Usage: "cirkit push "message" device"');
    console.log('Get devices: "cirkit devices"');
    console.log('Start/Stop server: "cirkit server start/stop"');
    process.exit();
    break;
  default:
    console.log('Missing argument. Try --help for usage');
}

function listDevices() {
  db.all("SELECT rowid AS id, ip, name FROM NODES", function(err, rows) {
      for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].id +': ' +rows[i].name);
      }
      process.exit();
  });
}

function sendPush(msg, ip) {
  client.send(msg, ip);
}
