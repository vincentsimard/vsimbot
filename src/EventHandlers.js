'use strict';

var nconf = require('nconf');
var fs = require("fs");

var bot, config;

// Common IRC events
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

  // @TODO: Use config.userName?
  "message#vsimbot": function(from, message) {
    var to = '#vsimbot';
    var match = message.match(/^(join|part)\s?(#?(\w*))?/i);
    var action, channel;
    var channels = config.channels;

    if (match) {
      action = match[1];
      channel = '#' + from;

      // @TODO: Allow users to specify which channel to join?
      // channel = match[3].length ? '#' + match[3] : channel;

      console.message('/%s %s'.input, to, from, action, channel);

      // Save channels in config
      if (action === 'join') {
        if (channels.indexOf(channel) < 0) {
          channels.push(channel);
        }
      }

      if (action === 'part') {
        channels = channels.filter(function(value) {
          return value !== channel;
        });
      }

      nconf.set('channels', channels);
      nconf.save(function(err) {
        if (err) { return console.error(err); }
      });

      bot[action](channel);
      console.say(to, action + 'ing ' + channel);
    }
  },

  /*
  "message#": function(from, to, message) {},
  "raw": function(message) { console.log(JSON.stringify(message)); },
  */

  init: function(ircClient, botConfig) {
    var events = Object.keys(EventHandlers);
    var handlersDir = __dirname + '/handlers';
    
    bot = ircClient;
    config = botConfig;

    for (var i=0; i<events.length-1; i++) {
      ircClient.addListener(events[i], EventHandlers[events[i]]);
    }

    // @TODO: Create a way to turn on/off modules from console
    fs.readdirSync(handlersDir).forEach(function(file) {
      var module = require(handlersDir + '/' + file);

      // @TODO: Log error if event or listener is undefined?
      if (typeof module.event === 'undefined') { return; }
      if (typeof module.listener === 'undefined') { return; }

      ircClient.addListener(module.event, module.listener);
    });
  }
};



module.exports = EventHandlers;
