'use strict';

var nconf = require('nconf');
var cpb = require('./../ChessPasteBin.js');



// post FEN to chesspastebin
var addFEN = function(from, to, message, raw, match) {
  var fen = match[0];

  console.message('/chesspastebin.addFEN %s'.input, to, from, fen);

  cpb.addFEN(nconf.get('chesspastebinAPIKey'), fen, from, undefined, nconf.get('chesspastebinSandbox'), function(data) {
    var cpbUrl = 'http://www.chesspastebin.com/?p=';
    var cpbId = data;
    var text = '';

    // @TODO: Log error if no id is returned by chesspastebin?
    if (isNaN(cpbId)) { return; }

    text = 'The FEN posted by ' + from + ' is now available at: ' + cpbUrl + cpbId;

    console.say(to, text);
  });
};

// Thanks to http://chess.stackexchange.com/questions/1482/how-to-know-when-a-fen-position-is-legal
// Halfmove clock and fullmove number are optional
var fenREPiecePlacement = "([rnbqkpRNBQKP1-8]+\\/){7}([rnbqkpRNBQKP1-8]+)";
var fenREActiveColor = "[bw-]";
var fenRECastlingAvailability = "(([a-hkqA-HKQ]{1,4})|(-))";
var fenREEnPassantTarget = "(([a-h][36])|(-))";
var fenREHalfMoveClock = "\\d*";
var fenREFullMoveNumber = "\\d*";
var fenRE = "" +
  fenREPiecePlacement + "\\s" +
  fenREActiveColor + "\\s" +
  fenRECastlingAvailability + "\\s" +
  fenREEnPassantTarget + "\\s?" +
  fenREHalfMoveClock + "\\s?" +
  fenREFullMoveNumber;

module.exports.event = 'message#';
module.exports.pattern = fenRE;
module.exports.handler = addFEN;
module.exports.condition = function(message) {
  return !message.match(/(eval|evaluate|analyze|score)\s/);
};
