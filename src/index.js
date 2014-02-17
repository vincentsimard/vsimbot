#!/usr/bin/env node

'use strict';

// @TODO: Handle all irc commands from stdin (join, part, etc.)
// @TODO: Guess names from ICC handles
// @TODO: Manage challenger queue

var irc = require('irc');
var fs = require('fs');
var nconf = require('nconf');

var cli = require('./CLI.js').CLI;
var handlers = require('./EventHandlers.js').EventHandlers;
var listeners = require('./Listeners.js').Listeners;

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();



var bot = new irc.Client(config.server, config.userName, config);



var init = function() {
  cli.init(bot);
  handlers.init(bot, config);
  listeners.init(bot);

  bot.connect(function() { console.log('connected.'); });
};



init();
