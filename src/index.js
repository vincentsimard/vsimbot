#!/usr/bin/env node

'use strict';

// @TODO: Handle all irc commands from stdin (join, part, etc.)
// @TODO: Manage challenger queue

var irc = require('irc');
var fs = require('fs');
var nconf = require('nconf');
var colors = require('colors');

var cli = require('./CLI.js');
var handlers = require('./EventHandlers.js');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();

var bot = new irc.Client(config.server, config.userName, config);

var loadTheme = function(name) {
  var THEME_PATH = __dirname + '/themes/';

  if (typeof name === 'undefined') { name = 'default'; }

  colors.setTheme(THEME_PATH + name + '.js');
};

var init = function() {
  console.log();
  loadTheme(config.theme);

  // @TODO: Initialize modules in a cleaner way... maybe?
  cli.init(bot);
  handlers.init(bot, config);

  bot.connect(function() { console.log('*** connected.'.info); });
};



init();
