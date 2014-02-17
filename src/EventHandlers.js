var EventHandlers = {
  error: function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
  },

  connect: function() {
    process.stdout.write('*** connecting... ');
  },

  join: function (channel, nick, message, callback) {
    // if (nick !== config.userName) { return; }
    if (nick !== 'vsimbot') { return; }

    console.log('*** joined %s', channel);
  },

  init: function(ircClient) {
    var events = Object.keys(EventHandlers);

    for (var i=0; i<events.length-1; i++) {
      ircClient.addListener(events[i], EventHandlers[events[i]]);
    }
  }
};



module.exports.EventHandlers = EventHandlers;
