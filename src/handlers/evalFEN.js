var util = require('util');
var child_process = require('child_process');
var nconf = require('nconf');



// evaluate position from fen
// @TODO: This is a mess
// @TODO: Show recommended move?
// @TODO: Add timeout with crafty.kill()?
var evalFEN = function(from, to, message, raw, match) {
  var crafty = child_process.spawn('crafty');
  var dataCache = [];
  var fen = match[2];
  var text = '';

  console.message('/eval %s'.input, to, from, fen);

  crafty.stderr.on('data', function (data) {
    // console.log('stderr: ' + data);
  });

  crafty.stdout.on('data', function (data) {
    dataCache.push(data);
  });

  crafty.on('exit', function (code) {
    var i = dataCache.length;

    var line, match;

    var depth, mates, mated;
    var values, time, score;

    while (i--) {
      line = dataCache[i] + '';
      match = line.match(/^\s*(\d+)\->|(mated?\sin\s\d+\smoves?)|((\d\-\d)\s\{(White|Black)\smates\})/i);

      if (match) { break; }
    }

    if (!match) { return; }

    depth = match[1];
    mates = match[2];
    mated = match[3];

    values = line.match(/\S+/ig);
    time  = values[1];
    score = values[2];

    if (depth) { text += score + ' (time=' + time + 's, depth=' + depth + ')'; }
    if (mates) { text += mates; } // @TODO: Specify which color mates or gets mated
    if (mated) { text += mated; }

    console.say(to, text);
  });

  // @TODO: Moves these options to a config file?
  crafty.stdin.write('log off\n');
  crafty.stdin.write('ponder off\n');
  crafty.stdin.write('st 30\n');
  // crafty.stdin.write('sd 18\n');
  // crafty.stdin.write('book off\n');

  crafty.stdin.write('setboard ' + fen + '\n');

  // crafty.stdin.write('score\n');
  crafty.stdin.write('go\n');
  crafty.stdin.write('quit\n');
};



module.exports.event = 'message#';

module.exports.listener = function(from, to, message) {
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

  var pattern = "(eval|evaluate|analyze|score)\\s(" + fenRE + ")";
  var args = Array.prototype.slice.call(arguments, 0);
  var match = message.match(new RegExp(pattern, "i"));

  if (match) {
    args.push(match);
    evalFEN.apply(this, args);
  }
};