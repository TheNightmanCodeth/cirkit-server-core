#!/usr/bin/env node
var spawn = require('child_process').spawn;
var client = require('./client.js');
var path = require('path');
var fs = require('fs');
var os = require('os');
var home = os.homedir();
var out = fs.openSync(path.join(home, '.cirkit.log'), 'a'),
    err = fs.openSync(path.join(home, '.cirkit.log'), 'a');
//SQLite database
var sqlite3 = require('sqlite3').verbose()
var db      = new sqlite3.Database(path.join(home, '.cirkitdb.sqlite3'));

switch (process.argv[2]) {
  case 'push':
    msg = process.argv[3];
    dev = process.argv[4];
    console.log(msg);
    db.each("SELECT rowid AS id, ip, name FROM NODES WHERE id=" +dev, function(err, row) {
      sendPush(msg, row.ip);
      console.log(row.ip);
    })
    break;
  case 'register':
    server = process.argv[3];
    name = process.argv[4];
    registerWithServer(server, name);
  case 'devices':
    listDevices();
    break;
  case 'server':
    var task = process.argv[3];
    if (task == 'start') {
      var child = spawn('node', [path.join(__dirname, 'server.js')], {
        stdio: ['ignore', out, err ],
        detached: true
      });
      //Write process id to file for killing later
      fs.writeFile(path.join(home, ".pid"), child.pid, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("PID file saved");
      })
      var interfaces = os.networkInterfaces();
      var addresses = [];
      for (var i in interfaces) {
          for (var i2 in interfaces[i]) {
              var address = interfaces[i][i2];
              if (address.family === 'IPv4' && !address.internal) {
                  addresses.push(address.address);
              }
          }
      }

      console.log('Server IP is ' +addresses +'...');
      process.exit();
    } else if (task == 'stop') {
      fs.exists(path.join(home, ".pid"), function(exists) {
        if (exists) {
          fs.readFile(path.join(home, ".pid"), 'utf8', function(err,data) {
            if (err) {
              console.log('No server process found!');
              return console.log(err);
            }
            console.log('Stopping server...');
            process.kill(data);
          });
        }
      });
    }
    break;
  case ('--help'):
  case ('help'):
  case ('-h'):
    console.log('Cirkit CLI client==================================');
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
      if (err == null) {
      	for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].id +': ' +rows[i].name +' (' +rows[i].ip +')');
      	}
	process.exit();
      }
      console.log('No registered devices!');
      process.exit();
  });
}

function registerWithServer(server, name) {
  var addresses = [];
  for (var i in interfaces) {
      for (var i2 in interfaces[i]) {
          var address = interfaces[i][i2];
          if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }

  thisIP = addresses[0];
  client.register(server, thisIP, name);
}

function sendPush(msg, ip) {
  client.send(msg, ip);
}
