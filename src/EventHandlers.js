'use strict';

var nconf = require('nconf');
var fs = require("fs");

var config = nconf.get();

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

  /*
  "message#": function(from, to, message) {},
  "raw": function(message) { console.log(JSON.stringify(message)); },
  */

  init: function(ircClient) {
    var events = Object.keys(EventHandlers);
    var handlersDir = __dirname + '/handlers';

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
