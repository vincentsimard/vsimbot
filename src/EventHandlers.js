'use strict';

var icc = require('./ICC.js');

var bot, config;

// Thanks to Siderite @ http://siderite.blogspot.com/2011/09/portable-game-notation-and-parsing-it.html
//var pgnRE = '(?<pgnGame>\s*(?:\[\s*(?<tagName>\w+)\s*"(?<tagValue>[^"]*)"\s*\]\\\s*s*)*(?:(?<moveNumber>\d+)(?<moveMarker>\.|\.{3})\s*(?<moveValue>(?:[PNBRQK]?[a-h]?[1-8]?x?(?:[a-h][1-8]|[NBRQK])(?:\=[PNBRQK])?|O(-?O){1,2})[\+#]?(\s*[\!\?]+)?)(?:\s*(?<moveValue2>(?:[PNBRQK]?[a-h]?[1-8]?x?(?:[a-h][1-8]|[NBRQK])(?:\=[PNBRQK])?|O(-?O){1,2})[\+#]?(\s*[\!\?]+)?))?\s*(?:\(\s*(?<variation>(?:(?<varMoveNumber>\d+)(?<varMoveMarker>\.|\.{3})\s*(?<varMoveValue>(?:[PNBRQK]?[a-h]?[1-8]?x?(?:[a-h][1-8]|[NBRQK])(?:\=[PNBRQK])?|O(-?O){1,2})[\+#]?(\s*[\!\?]+)?)(?:\s*(?<varMoveValue2>(?:[PNBRQK]?[a-h]?[1-8]?x?(?:[a-h][1-8]|[NBRQK])(?:\=[PNBRQK])?|O(-?O){1,2})[\+#]?(\s*[\!\?]+)?))?\s*(?:\((?<varVariation>.*)\)\s*)?(?:\{(?<varComment>[^\}]*?)\}\s*)?)*)\s*\)\s*)*(?:\{(?<comment>[^\}]*?)\}\s*)?)*(?<endMarker>1\-?0|0\-?1|1/2\-?1/2|\*)?\s*)';
// pgnRE = '(\d+)\.
// ([KQNBR])?
// (([a-h][1-8])|((1-0)|(0-1)|(1/2-1/2)|(\*)))([!?+]|ep)
// (([KQNBR])?
// (([a-h][1-8])|((1-0)|(0-1)|(1/2-1/2)|(\*)))([!?+]|ep))?'

// @TODO: This is a very simplistic pgn regexp.
//        It's missing game result, header, comments, etc.
var pgnRENumber = "\\d+\\.\\s*";
var pgnREPly = "\\w{2,8}\\s*";
var pgnRETwoPlys = "(" + pgnRENumber + pgnREPly + pgnREPly + "\\s*)";
var pgnRE = "(" + pgnRETwoPlys + "{2,}\\s*(" + pgnRENumber + pgnREPly + ")?)";

var patterns = {};

// finger icc
patterns["^(finger|fi|who\\sis|who\\'s)\\s(.*)"] = function(from, to, message, junk, match) {
  var handle;

  handle = match[2];
  handle = handle.replace(/[^\w\s-]/gi, ''); // ICC handles must be alphanumeric

  console.message('/finger %s'.input, to, from, handle.bold);
  
  icc.finger(handle, function(exists, name, title, rating, profileUrl) {
    var text = '';

    if (name && name.length) { text += '"' + handle + '" is ' + title + ' ' + name; }
    if (rating && rating.length) { text += ' (FIDE ' + rating + ')'; }
    if (profileUrl && profileUrl.length) { text += ' ' + profileUrl; }

    // @TODO: Distinguish if account doesn't exist or if publicinfo is disabled?
    if (!text.length && exists) { text = 'No public info for "' + handle + '"'; }

    bot.say(to, text);
    console.message('%s', to, config.userName, text);
  });
};

// post pgn to chesspastebin
patterns[pgnRE] = function(from, to, message, junk, match) {
  var pgn = match[0];

  console.message('/chesspastebin %s'.input, to, from, pgn.bold);
};



var EventHandlers = {
  error: function(message) {
    console.error('ERROR: %s: %s'.error, message.command, message.args.join(' '));
  },

  connect: function() {
    console.log('*** connecting to %s... '.irc, config.server.bold);
  },

  disconnect: function() {
    console.log('*** disconnected'.irc);
  },

  join: function (channel, nick, message, callback) {
    if (nick !== config.userName) { return; }

    console.log('*** joined %s'.irc, channel.bold);
  },

  part: function (channel, nick, message, callback) {
    if (nick !== config.userName) { return; }

    console.log('*** parted %s'.irc, channel.bold);
  },

  "message#": function(from, to, message) {
    var match;
    var args = Array.prototype.slice.call(arguments, 0);

    for (var pattern in patterns) {
      if (patterns.hasOwnProperty(pattern)) {
        match = message.match(new RegExp(pattern, "i"));

        if (match) {
          args.push(match);
          patterns[pattern].apply(this, args);
          return;
        }
      }
    }
  },

  init: function(ircClient, botConfig) {
    var events = Object.keys(EventHandlers);
    
    bot = ircClient;
    config = botConfig;

    for (var i=0; i<events.length-1; i++) {
      ircClient.addListener(events[i], EventHandlers[events[i]]);
    }
  }
};



module.exports = EventHandlers;
