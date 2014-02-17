var icc = require('./ICC.js');

var bot, config;

var messageHandlers = {
  isThisPatrick: function(from, to, message) {
    var match = message.match(/^is this/i);
    
    if (!to.match(/^[#&]/)) { return; }
    if (!match) { return; }
    
    bot.say(to, 'No, this is Patrick! KevinTurtle');
  },

  finger: function(from, to, message) {
    var match = message.match(/^(finger|fi|who\sis|who\'s)\s(.*)/i);
    var handle;
    
    if (!match) { return; }

    // ICC handles are alphanumeric
    handle = match[2].replace(/[^\w\s-]/gi, '');

    console.log('/finger %s', handle);
    
    icc.finger(handle, function(name, title, rating, profileUrl) {
      var text = '';

      if (name && name.length) { text += '"' + handle + '" is ' + title + ' ' + name; }
      if (rating && rating.length) { text += ' (FIDE ' + rating + ')'; }
      if (profileUrl && profileUrl.length) { text += ' ' + profileUrl; }

      if (text.length) {
        bot.say(to, text);
      }
    });
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



module.exports = EventHandlers;
