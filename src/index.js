#!/usr/bin/env node

'use strict';

// @TODO: Handle all irc commands from stdin (join, part, etc.)
// @TODO: Guess names from ICC handles
// @TODO: Manage challenger queue

var irc = require('irc');
var fs = require('fs');
var nconf = require('nconf');

var handlers = require('./eventHandlers.js').handlers;

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();



var bot = new irc.Client(config.server, config.userName, config);



var isThisPatrick = function(from, to, message) {
  var messageMatch = message.match(/^is this/i);
  
  if (!to.match(/^[#&]/)) { return; }
  if (!messageMatch) { return; }
  
  bot.say(to, 'No, this is Patrick! KevinTurtle');
};



// @TODO: Extract commands
var cmdSay = function(args) {
  var matches = args.match(/^(#\w+)\s(.*)/);
  var channel, message;

  if (!matches) { return; }

  channel = matches[1];
  message = matches[2];

  bot.say(channel, message);
};



// Handle stdin
process.openStdin().on('data', function(chunk) {
  var chunk = chunk + '';
  var matches = chunk.match(/^\/(\w+)\s(.*)/);
  var command, args;

  if (!matches) { return; }

  command = matches[1];
  args = matches[2];

  switch (command) {
    case 'say':
      cmdSay(args);
      break;
    default:
      console.log('Unrecognized command: %s', command);
  }
});


var initHandlers = function() {
  var events = Object.keys(handlers);

  for (var i=0; i<events.length; i++) {
    bot.addListener(events[i], handlers[events[i]]);
  }

  bot.addListener('message', isThisPatrick);
};



initHandlers();
bot.connect(function() { console.log('connected.'); });
