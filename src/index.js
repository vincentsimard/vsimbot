#!/usr/bin/env node

'use strict';

// @TODO: Handle all irc commands from stdin (join, part, etc.)
// @TODO: Guess names from ICC handles
// @TODO: Manage challenger queue

var irc = require('irc');
var fs = require('fs');
var nconf = require('nconf');

var handlers = require('./EventHandlers.js').EventHandlers;
var cli = require('./CLI.js').CLI;

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
bot.addListener('message', isThisPatrick);



var init = function() {
  handlers.init(bot);
  cli.init(bot);

  bot.connect(function() { console.log('connected.'); });
};



init();
