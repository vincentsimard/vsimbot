'use strict';

var bot;

var commands = {
  connect: function() { bot.connect(function() { console.log('*** connected.'.info); }); },
  disconnect: function() { bot.disconnect(); },
  join: function(channel) { bot.join(channel); },
  part: function(channel) { bot.part(channel); },
  say: function(args) {
    var matches = args.match(/^(#\w+)\s(.*)/); // #[channelname] [message]
    var channel, message;

    if (!matches) { return; }

    channel = matches[1];
    message = matches[2];

    bot.say(channel, message);
  }
};

var CLI = {
  init: function(ircClient) {
    if (typeof ircClient === 'undefined') { return; }

    bot = ircClient;

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



module.exports = CLI;
