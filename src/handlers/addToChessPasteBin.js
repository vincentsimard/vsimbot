'use strict';

var nconf = require('nconf');
var cpb = require('./../ChessPasteBin.js');



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
  
  addToChessPasteBin(from, to, message, raw, match);
};

// post FEN to chesspastebin
var addFEN = function(from, to, message, raw, match) {
  addToChessPasteBin(from, to, message, raw, match, true);
};

var addToChessPasteBin = function(from, to, message, raw, match, isFEN) {
  var pgn = match[0];
  var format = isFEN ? 'FEN' : 'PGN';
  var fnName = 'add' + format;

  console.message('/chesspastebin.%s %s'.input, to, from, fnName, pgn);

  cpb[fnName](nconf.get('chesspastebinAPIKey'), pgn, from, undefined, nconf.get('chesspastebinSandbox'), function(data) {
    var cpbUrl = 'http://www.chesspastebin.com/?p=';
    var cpbId = data;
    var text = '';

    // @TODO: Log error if no id is returned by chesspastebin?
    if (!isNaN(cpb)) { return; }

    text = 'The ' + format + ' posted by ' + from + ' is now available at: ' + cpbUrl + cpbId;

    console.say(to, text);
  });
};



module.exports.event = 'message#';

module.exports.listener = function(from, to, message) {
  // @TODO: This is a very simplistic pgn regexp. No support for variations or comments
  var pgnRENumber = "\\d+\\.\\s*";
  var pgnREPly = "[\\w\\+\\-#=]{2,8}\\s*";
  var pgnREOnePly = "(" + pgnRENumber + pgnREPly + ")";
  var pgnRETwoPlys = "(" + pgnRENumber + pgnREPly + pgnREPly + "\\s*)";
  var pgnREHeader = "(\\[([^\\]]+)\\]\\s*)*";
  var pgnREResult = "(\\*|1\\-0|0\\-1|0\\.5\\-0\\.5|\\.5\\-\\.5|1\\/2\\-1\\/2)?";
  var pgnRE = "(" +
    pgnREHeader +
    pgnRETwoPlys + "{2,}\\s*" +
    pgnREOnePly + "?" +
    pgnREResult +
    ")";

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

  var args = Array.prototype.slice.call(arguments, 0);
  var match;

  if (message.match(/(eval|evaluate|analyze|score)\s/)) { return; }

  match = message.match(new RegExp(pgnRE, "i"));
  if (match) {
    args.push(match);
    addPGN.apply(this, args);

    return;
  }

  match = message.match(new RegExp(fenRE, "i"));
  if (match) {
    args.push(match);
    addFEN.apply(this, args);

    return;
  }
};