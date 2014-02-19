'use strict';

var icc = require('./ICC.js');
var cpb = require('./ChessPasteBin.js');

var bot, config;

// @TODO: This is a very simplistic pgn regexp.
//        It's missing game result, header, comments, etc.
// @TODO: At least parse the player names
var pgnRENumber = "\\d+\\.\\s*";
var pgnREPly = "[\\w\\+\\-#=]{2,8}\\s*";
var pgnRETwoPlys = "(" + pgnRENumber + pgnREPly + pgnREPly + "\\s*)";
var pgnREResult = "(\\*|1\\-0|0\\-1|0\\.5\\-0\\.5|\\.5\\-\\.5|1\\/2\\-1\\/2)?";
var pgnRE = "(" + pgnRETwoPlys + "{2,}\\s*(" + pgnRENumber + pgnREPly + ")?" + pgnREResult + ")";

var patterns = {};

// finger icc
patterns["^(finger|fi|who\\sis|who\\'s)\\s(.*)"] = function(from, to, message, junk, match) {
  var handle;

  handle = match[2];
  handle = handle.replace(/[^\w\s-]/gi, ''); // ICC handles must be alphanumeric

  console.message('/finger %s'.input, to, from, handle.bold);
  
  icc.finger(handle, function(exists, name, title, rating, profileUrl) {
    if (!exists) { return; }

    var text = '';

    if (name && name.length) { text += '"' + handle + '" is ' + title + ' ' + name; }
    if (rating && rating.length) { text += ' (FIDE ' + rating + ')'; }
    if (profileUrl && profileUrl.length) { text += ' ' + profileUrl; }

    // @TODO: Distinguish if account doesn't exist or if publicinfo is disabled?
    //        Currently not displaying anything if the account doesn't exist
    if (!text.length && exists) { text = 'No public info for "' + handle + '"'; }

    bot.say(to, text);
    console.message('%s', to, config.userName, text);
  });
};

// post pgn to chesspastebin
patterns[pgnRE] = function(from, to, message, junk, match) {
  var pgn = match[0];

  console.message('/chesspastebin %s'.input, to, from, pgn.bold);

  cpb.add(config.chesspastebinAPIKey, pgn, from, undefined, config.chesspastebinSandbox, function(data) {
    var cpbUrl = 'http://www.chesspastebin.com/?p=';
    var cpbId = data;
    var text = '';

    // @TODO: Log error? No id returned by chesspastebin
    if (!isNaN(cpb)) { return; }

    text = 'The pgn posted by ' + from + ' is now viewable at: ' + cpbUrl + cpbId;

    bot.say(to, text);
    console.message('%s', to, config.userName, text);
  });
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
