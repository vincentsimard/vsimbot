'use strict';

var nconf = require('nconf');
var _ = require('underscore');
var client = require('./Client.js');
var handlers = require('./EventHandlers.js');

var commands = {
  connect: function() { client.irc.connect(function() { console.log('*** connected.'.info); }); },
  disconnect: function() { client.irc.disconnect(); },
  join: function(channel) { client.irc.join(channel); },
  part: function(channel) { client.irc.part(channel); },
  say: function(args) {
    var matches = args.match(/^(#\w+)\s(.*)/); // #[channelname] [message]
    var channel, message;

    if (!matches) { return; }

    channel = matches[1];
    message = matches[2];

    client.irc.say(channel, message);
  },
  channels: function() { console.log(_.keys(client.irc.chans)); }
};

var CLI = {
  init: function() {
    process.openStdin().on('data', function(chunk) {
      var chunk = chunk + '';
      var matches = chunk.match(/^\/(\w+)\s(.*)/);
      var command, args;

      if (!matches) { return; }

      command = matches[1];
      args = matches[2];

      if (command in commands) {
        commands[command](args);
      } else {
        console.log('Unrecognized command: %s'.error, command);
      }
    });
  }
};

/*
  console.log() for irc messages

  arguments:
   - text
   - to
   - from
   - *format specifiers
*/
console.message = function() {
  var args = Array.prototype.slice.call(arguments, 0);

  // Bold style for commands
  args[0] = args[0].replace(/(\/[^\s]+)/, '$1'.bold);

  args[0] = '%s <%s> ' + args[0];
  args[1] = args[1].channel;
  args[2] = args[2].user;
  
  console.log.apply(this, args);
};

console.say = function(to, text, raw) {
  var isWhisper = function() { return typeof raw !== 'undefined' && raw.rawCommand === 'WHISPER'; }
  var textPrefix = isWhisper() ? '/w ' + raw.user + ' ' : '';

  text = textPrefix + text;

  if (raw.discord) {
    raw.reply(text);
  } else {
    client.irc.say(to, text);
  }
  
  console.message('%s', to, nconf.get('userName'), text);
};




module.exports = CLI;
