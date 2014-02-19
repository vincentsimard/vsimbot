'use strict';

var request = require('request');
var http = require('http');

var CPB = {
  add: function(apikey, pgn, name, email, sandbox, callback) {
    var url = 'http://www.chesspastebin.com/api/add/';

    // pgn = '1. e4 e5 2. Nf3 Nc6';

    request.post(url, {
      apikey: apikey,
      pgn: pgn,
      name: 'vsimbot',
      email: 'vsimbot@vsimbot.com',
      sandbox: true
    }, callback);
  },

  add2: function(pgn, apikey) {
    var self = this;
    var content = 'apikey=' + apikey + '&pgn=' + pgn + '&sandbox=true';

    var options = {
      hostname: 'www.chesspastebin.com',
      port: 80,
      path: '/api/add/',
      method: 'POST',
      headers: {
        "User-Agent": "vsimbot",
        "Content-Type": "application/x-www-form-urlencoded",
        "Connection": "close",
        "Keep-Alive": "",
        "Accept": "text/json",
        "Accept-Charset": "UTF8",
        "Content-length": content.length
      }
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) { 
       console.log(chunk);
      });
    });
    req.on('error', function(e) {
      console.log(e);
    });

    req.end(content, 'utf8');
  },
};

module.exports = CPB;