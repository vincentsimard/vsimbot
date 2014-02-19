'use strict';

// var request = require('request');
var http = require('http');

var CPB = {
  /*
  // @TODO: I'd much rather use 'request' but I'm getting 'INVALID REQUEST' from cpb. bah!
  add: function(apikey, pgn, name, email, sandbox, callback) {
    var url = 'http://www.chesspastebin.com/api/add/';

    request.post(url, {
      apikey: apikey,
      pgn: pgn,
      sandbox: true
    }, callback);
  },
  */

  add: function(apikey, pgn, name, email, sandbox, callback) {
    if (typeof apikey === 'undefined') { return; }
    if (typeof pgn === 'undefined') { return; }

    var content = 'apikey=' + apikey + '&pgn=' + pgn + '&sandbox=' + !!sandbox;

    if (typeof name !== 'undefined') { content += '&name=' + name; }
    if (typeof email !== 'undefined') { content += '&email=' + email; }

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
      res.on('data', callback);
    });

    req.on('error', function(err) { console.error(err); });

    req.end(content, 'utf8');
  },

  addPGN: function(apikey, pgn, name, email, sandbox, callback) {
    this.add(apikey, pgn, name, email, sandbox, callback);
  },

  addFEN: function(apikey, fen, name, email, sandbox, callback) {
    // Need to wrap FEN/EPD in PGN header to be able to post on chesspastebin
    if (typeof fen !== 'undefined') {
      fen = "[FEN " + fen + "]";
    }

    this.add(apikey, fen, name, email, sandbox, callback);
  }
};

module.exports = CPB;