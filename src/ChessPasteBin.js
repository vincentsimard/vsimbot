'use strict';

var request = require('request');

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
  }
};

module.exports = CPB;