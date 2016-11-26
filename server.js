var os = require('os')
//Express.js
var express = require('express')
var app     = express()
//For parsing json requests
var bodyParser = require('body-parser')
//SQLite database
var sqlite3 = require('sqlite3').verbose()
var db      = new sqlite3.Database('db.sqlite3', createTable)
//Use Express body parser
app.use(bodyParser.json())
var notifier = require('node-notifier');

function createTable() {
    //console.log('Creating pushes table if not already created...')
    db.run("CREATE TABLE IF NOT EXISTS PUSHES (push TEXT NOT NULL, device TEXT NOT NULL)")
    //console.log('Creating nodes table if not already created...')
    db.run("CREATE TABLE IF NOT EXISTS NODES (ip TEXT NOT NULL, name TEXT NOT NULL)")
}

//Listen for connections to /cirkit/ and store msg to sqlite
app.post('/cirkit', function(req, res) {
    var push = req.body.push
    var device = req.body.device
    db.run("INSERT INTO PUSHES (push,device) VALUES (?,?)", [push, device])
    res.json({"response":"Received push from " +device})
    console.log("Received push: '" +push +"' from: " +device)
    notifier.notify({
        'title':'Push received',
        'message':push
    });
})

//Listen for connections to /list/ and return list of pushes
app.get('/pushes', function(req, res) {
    db.all("SELECT rowid AS id, push FROM PUSHES", function(err, rows) {
        res.json(rows)
    })
})

//Listen for connections to /register and add device IP to devices
app.post('/register', function(req, res) {
    var ip  = req.body.ip
    var name = req.body.name
    db.run("INSERT INTO NODES (ip,name) VALUES (?,?)", [ip,name])
    res.json({"response":"Added device '" +name +"' with ip '" +ip +"'"})
    console.log("Registered device with ip: " +ip)
})

//Listen for connections to /devices and return list of devices
app.get('/devices', function(req, res) {
    db.all("SELECT rowid AS id, ip, name FROM NODES", function(err, rows) {
        res.json(rows)
    })
})

var server = app.listen(6969, function() {
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
})
