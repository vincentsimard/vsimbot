'use strict';

var nconf = require('nconf');
var cpb = require('./../ChessPasteBin.js');
var Utils = require('./../Utils.js');



// post PGN to chesspastebin
var addPGN = function(from, to, message, raw, match) {
  // additional verification to make sure the first 2 moves are present
  // to prevent messages like "http://chess-db.com/public/game.jsp?id=14101513.4202848.139710976" to match "14101513.4202848.139710976"
  if (match &&
      match[0] &&
      match[0].indexOf('1.') < 0 &&
      match[0].indexOf('2.') < 0) {
    return;
  }
  
  var key = nconf.get('chesspastebinAPIKey');
  var pgn = match[0];
  var sandbox = nconf.get('chesspastebinSandbox');

  console.message('/chesspastebin.addPGN %s'.input, to, from, pgn);

  cpb.addPGN(key, pgn, from, undefined, sandbox, function(id) {
    if (isNaN(id)) { return; }

    var url = 'http://www.chesspastebin.com/?p=' + id;
    var text = 'The PGN posted by ' + from + ' is now available at: ' + url;

    console.say(to, text);
  });
};



module.exports.event = 'message#';
module.exports.pattern = Utils.pgnRE;
module.exports.handler = addPGN;
module.exports.condition = function(message) {
  return !message.match(/(eval|evaluate|analyze|score)\s/);
};
