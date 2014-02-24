'use strict';

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

module.exports = {
  getParameterByName: function(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  fenRE: fenRE,
  pgnRE: pgnRE
};