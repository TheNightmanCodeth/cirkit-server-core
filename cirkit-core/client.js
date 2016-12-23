var request = require('request');

exports.send = function (msg, sendTo) {
  request.post('http://' +sendTo +':6969/',
      { json: {msg: encodeURIComponent(msg), sender: "Cirkit Server"}},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
        }
      });
}

exports.register = function(server, ip, name) {
  request.post('http://' +server +':6969/',
    {json: {ip: ip, name: name}},
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    })
}
