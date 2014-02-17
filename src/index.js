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

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();



var bot = new irc.Client(config.server, config.userName, config);



var init = function() {
  // @TODO: Initialize modules in a cleaner way
  cli.init(bot);
  handlers.init(bot, config);

  bot.connect(function() { console.log('connected.'); });
};



init();
