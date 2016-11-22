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

function createTable() {
    console.log('Creating pushes table if not already created...')
    db.run("CREATE TABLE IF NOT EXISTS pushes (data TEXT)")
}

//Listen for connections to /cirkit/ and store msg to sqlite
app.post('/cirkit', function(req, res) { 
    var todb = db.prepare("INSERT INTO pushes VALUES (?)")
    var push = req.body.msg
    todb.run(push)
    todb.finalize()
    res.json({"response":"Success"})
    console.log("Received push: " +push)
})

//Listen for connections to /list/ and return list of pushes
app.get('/pushes', function(req, res) {
    db.all("SELECT rowid AS id, data FROM pushes", function(err, rows) {
        res.json(rows)
    })
})

function closeDb() {
    db.close()
}

app.listen(6969, function() {
    console.log('Listening on port 6969...')
})
