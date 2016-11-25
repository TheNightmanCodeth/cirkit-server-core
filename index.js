var electron = require('app'), 
    window = require('browser-window');
var mainWin = null;

electron.on('ready', function() {
    mainWin = new window({
        width: 600,
        height: 200
    });
    mainWin.loadUrl('file://' + __dirname + '/ui/main.html');
    mainWin.openDevTools();
}
