var bot;

var commands = {
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

      switch (command) {
        case 'say':
          commands.say(args);
          break;
        default:
          console.log('Unrecognized command: %s', command);
      }
    });
  }
};



module.exports = CLI;
