const electron = require('electron');
const app = electron.app;
const window = electron.BrowserWindow;
const url = require('url');
const path = require('path');
var server = require('./server.js');
var spawn = require('electron-spawn');
var mainWin = null;

function makeWindow() {
    console.log('yeet');
    mainWin = new window({
        width: 450,
        height: 200
    });
    mainWin.loadURL(url.format({
        pathname: path.join(__dirname, 'ui/main.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWin.webContents.openDevTools();
    mainWin.on('closed', () => {
        mainWin = null
    });
    startServer();
}

function startServer() {
    var serve = spawn('./server.js', {detached: true});
    serve.stderr.on('data', (data) => {
        console.error(data.toString())
    })
    serve.stdout.on('data', (data) => {
        console.log(data.toString())
    })
}

app.on('ready', makeWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        process.exit();
    }
});
app.on('activate', () => {
    if (win === null) {
        makeWindow()
    }
});
