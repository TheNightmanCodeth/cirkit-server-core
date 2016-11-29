var request = require('request');

var send = function (msg, sendTo) {
  request.post('http://' +sendTo +':6969/',
      { json: {push: msg}},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
        }
      });
}

function sendFromDOM() {
  var msg = document.getElementById('pushtext').value;
  request.post('http://' +'192.168.1.113' +':6969/',
      { json: {push: msg }},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
        }
      });
}

exports.send = send;
