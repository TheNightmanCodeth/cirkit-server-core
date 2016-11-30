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
exports.send = send;
