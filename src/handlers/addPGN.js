'use strict';

var Utils = require('./../Utils.js');
var request = require('request');

// post PGN to lichess.org
var addPGN = function(from, to, message, raw, match) {
  // additional verification to make sure the first 2 moves are present
  // to prevent messages like "http://chess-db.com/public/game.jsp?id=14101513.4202848.139710976" to match "14101513.4202848.139710976"
  if (match &&
      match[0] &&
      match[0].indexOf('1.') < 0 &&
      match[0].indexOf('2.') < 0) {
    return;
  }

  var pgn = match[0];

  console.message('/lichess.addPGN %s'.input, to, from, pgn);

  request.post(
    'http://en.lichess.org/import', {
      form: {
        pgn: pgn
      }
    },
    function(error, response, body) {
      if (!error && response.statusCode == 303) {
        var url = 'http://lichess.org' + response.headers['location'];
        var text = 'The PGN posted by ' + from + ' is now available at: ' + url;
        console.say(to, text, raw);
      }
    }
  );
};

module.exports.event = 'message#';
module.exports.pattern = Utils.pgnRE;
module.exports.handler = addPGN;
module.exports.condition = function(message) {
  return !message.match(/(eval|evaluate|analyze|score)\s/);
};
