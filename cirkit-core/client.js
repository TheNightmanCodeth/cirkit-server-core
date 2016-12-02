var request = require('request');

exports.send = function (msg, sendTo) {
  request.post('http://' +sendTo +':6969/',
      { json: {msg: msg, sender: "Cirkit Server"}},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
        }
      });
}
