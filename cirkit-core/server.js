var os = require('os')
//Express.js
var express = require('express')
var app     = express()
//For parsing json requests
var bodyParser = require('body-parser')
var path = require('path');
//SQLite database
var sqlite3 = require('sqlite3').verbose()
var db      = new sqlite3.Database(path.join(__dirname, 'db.sqlite3'), createTable)
//Use Express body parser
app.use(bodyParser.json())
var notifier = require('node-notifier');
//For copying push to clipboard
var ncp = require('copy-paste');

function createTable() {
    //console.log('Creating pushes table if not already created...')
    db.run("CREATE TABLE IF NOT EXISTS PUSHES (push TEXT NOT NULL, device TEXT NOT NULL)")
    //console.log('Creating nodes table if not already created...')
    db.run("CREATE TABLE IF NOT EXISTS NODES (ip TEXT NOT NULL UNIQUE, name TEXT NOT NULL UNIQUE)")
}

  //Listen for connections to /cirkit/ and store msg to sqlite
  app.post('/cirkit', function(req, res) {
      var push = req.body.push
      var device = req.body.device
      db.run("INSERT INTO PUSHES (push,device) VALUES (?,?)", [push, device])
      res.json({"response":"Received push from " +device})
      console.log("Received push: '" +push +"' from: " +device)
      notifier.notify({
          'title':'Push received from: ' +device,
          'message':push
      });
      ncp.copy(push, function() {
        console.log("Copied to cb");
      })
  });

  //Listen for connections to /list/ and return list of pushes
  app.get('/pushes', function(req, res) {
      db.all("SELECT rowid AS id, push FROM PUSHES", function(err, rows) {
          res.json(rows)
      })
  });

  //Listen for connections to /register and add device IP to devices
  app.post('/register', function(req, res) {
      var ip  = req.body.ip
      var name = req.body.name
      db.all("SELECT rowid AS id, ip, name FROM NODES", function(err, rows) {
        if (rows == null) {
          //There are no devices registered so no need to worry about dupes
          db.run("INSERT INTO NODES (ip,name) VALUES (?,?)", [ip,name])
          res.json({"response":"Added device '" +name +"' with ip '" +ip +"'"})
          console.log("Registered device with ip: " +ip)
        } else {
          //There are registered devices, make sure this one isn't already registered
          var isDup = false;
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.ip == ip) {
              isDup = true;
              res.json({"response":"ERROR: Device exists on server"})
              console.log("Duplicate device not registered")
            } else if (row.name == name) {
              isDup = true;
              res.json({"response":"ERROR: Device exists on server"})
              console.log("Duplicate device not registered")
            }
          }
          if (!isDup) {
            db.run("INSERT INTO NODES (ip,name) VALUES (?,?)", [ip,name])
            res.json({"response":"Added device '" +name +"' with ip '" +ip +"'"})
            console.log("Registered device with ip: " +ip)
          }
        }
      });
  });

  //Listen for connections to /devices and return list of devices
  app.get('/devices', function(req, res) {
      db.all("SELECT rowid AS id, ip, name FROM NODES", function(err, rows) {
          res.json(rows)
          //console.log(rows);
      })
  });

  app.listen(6969, function() {
  });
