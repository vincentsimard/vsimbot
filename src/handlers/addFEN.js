'use strict';

var nconf = require('nconf');
var cpb = require('./../ChessPasteBin.js');
var Utils = require('./../Utils.js');



// post FEN to chesspastebin
var addFEN = function(from, to, message, raw, match) {
  var key = nconf.get('chesspastebinAPIKey');
  var fen = match[0];
  var sandbox = nconf.get('chesspastebinSandbox');

  console.message('/chesspastebin.addFEN %s'.input, to, from, fen);

  cpb.addFEN(key, fen, from, undefined, sandbox, function(id) {
    if (isNaN(id)) { return; }

    var url = 'http://www.chesspastebin.com/?p=' + id;
    var text = 'The FEN posted by ' + from + ' is now available at: ' + url;

    console.say(to, text);
  });
};



module.exports.event = 'message#';
module.exports.pattern = Utils.fenRE;
module.exports.handler = addFEN;
module.exports.condition = function(message) {
  return !message.match(/(eval|evaluate|analyze|score)\s/);
};
