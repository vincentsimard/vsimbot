#!/usr/bin/env node

'use strict';

// @TODO: Handle all irc commands from stdin (join, part, etc.)
// @TODO: Manage challenger queue

var irc = require('irc');
var fs = require('fs');
var nconf = require('nconf');

var cli = require('./CLI.js');
var handlers = require('./EventHandlers.js');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();



var bot = new irc.Client(config.server, config.userName, config);



var init = function() {
  // @TODO: Initialize modules in a cleaner way... maybe?
  cli.init(bot);
  handlers.init(bot, config);

  bot.connect(function() { console.log('connected.'); });
};



init();
