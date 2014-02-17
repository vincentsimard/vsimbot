var bot, config;

var messageHandlers = {
  isThisPatrick: function(from, to, message) {
    var match = message.match(/^is this/i);
    
    if (!to.match(/^[#&]/)) { return; }
    if (!match) { return; }
    
    bot.say(to, 'No, this is Patrick! KevinTurtle');
  },

  finger: function(from, to, message) {
    if (message.match(/^finger/i)) {
      console.log('finger');
    }
  }
};



var EventHandlers = {
  error: function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
  },

  connect: function() {
    process.stdout.write('*** connecting... ');
  },

  join: function (channel, nick, message, callback) {
    if (nick !== config.userName) { return; }

    console.log('*** joined %s', channel);
  },

  message: function(from, to, message) {
    for (var key in messageHandlers) {
      if (messageHandlers.hasOwnProperty(key)) {
        messageHandlers[key].apply(this, arguments);
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



module.exports.EventHandlers = EventHandlers;
