'use strict';

var icc = require('./ICC.js');

var bot, config;

var patterns = {
  // finger
  "^(finger|fi|who\\sis|who\\'s)\\s(.*)": function(from, to, message, handle) {
    // ICC handles must be alphanumeric
    handle = handle.replace(/[^\w\s-]/gi, '');

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
  },

  // is this x?
  "^is this": function(from, to, message) {
    if (to !== '#cooltrainermichael') { return; }
    bot.say(to, 'No, this is Patrick! KevinTurtle');
  },

  "^!winner": function() {}
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
    var match;
    var args = Array.prototype.slice.call(arguments, 0);

    // Only handle channel messages (for now)
    if (!to.match(/^[#&]/)) { return; }

    for (var pattern in patterns) {
      if (patterns.hasOwnProperty(pattern)) {
        match = message.match(new RegExp(pattern, "i"));
        
        if (match) {
          args.pop(); // Removes junk param sent by node-irc
          args.push(match[2]); // Keeps the string after the pattern

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
