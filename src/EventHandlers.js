'use strict';

var nconf = require('nconf');
var fs = require("fs");

var client = require('./Client.js');

var config;
var loadedHandlers = {};

var EventHandlers = {
  // Common IRC events
  common: {
    /*
    "message#": function(from, to, message) {},
    "raw": function(message) { console.log(JSON.stringify(message)); },
    */

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
      if (channel === '#yummyhat') {
        console.say(channel, '/ban ' + nick);
      }

      if (nick !== config.userName) { return; }

      console.log('*** joined %s'.irc, channel.bold);
    },

    part: function (channel, nick, message, callback) {
      if (nick !== config.userName) { return; }

      console.log('*** parted %s'.irc, channel.bold);
    }
  },

  add: function(file, quiet) {
    var self = this;
    var handlersDir = __dirname + '/handlers';
    var module = require(handlersDir + '/' + file);

    var handler = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      var message = args[args.length-2];
      var match = message.match(new RegExp(module.pattern, "i"));

      if (typeof module.event === 'undefined') { return; }
      if (typeof module.pattern === 'undefined') { return; }
      if (typeof module.handler === 'undefined') { return; }

      if (typeof module.condition === 'function') {
        if (!module.condition(message)) { return; }
      }

      if (match) {
        args.push(match);
        module.handler.apply(this, args);
      }
    };

    loadedHandlers[file] = handler;

    client.addListener(module.event, loadedHandlers[file]);

    if (!quiet) { console.log('Added module: ' + file); }
  },

  remove: function(file, quiet) {
    var self = this;
    var handlersDir = __dirname + '/handlers';
    var module = require(handlersDir + '/' + file);

    if (typeof module.event === 'undefined') { return; }

    client.removeListener(module.event, loadedHandlers[file]);

    if (!quiet) { console.log('Removed module: ' + file); }
  },

  init: function() {
    var self = this;
    var handlersDir = __dirname + '/handlers';
    var events = Object.keys(self.common);

    config = nconf.get();

    for (var i=0; i<events.length; i++) {
      client.addListener(events[i], self.common[events[i]]);
    }

    // @TODO: http://jsperf.com/chsspttrns
    fs.readdirSync(handlersDir).forEach(function(file) {
      self.add(file, true);
    });
  }
};



module.exports = EventHandlers;
