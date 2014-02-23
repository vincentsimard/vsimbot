#!/usr/bin/env node

'use strict';

// @TODO: Manage challenger queue
// @TODO: Log network connection loss/disconnections

var irc = require('irc');
var fs = require('fs');
var nconf = require('nconf');
var colors = require('colors');

var cli = require('./src/CLI.js');
var handlers = require('./src/EventHandlers.js');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();

var bot = new irc.Client(config.server, config.userName, config);

// @TODO: Move theme init to separate module?
var loadTheme = function(name) {
  var THEME_PATH = __dirname + '/src/themes/';

  if (typeof name === 'undefined') { name = 'default'; }

  colors.setTheme(THEME_PATH + name + '.js');
};

var init = function() {
  // @TODO: Remove globals asap
  global.ircClient = bot;

  loadTheme(config.theme);

  // @TODO: Initialize modules in a cleaner way... maybe?
  cli.init(bot);
  handlers.init(bot);

  bot.connect(function() { console.log('*** connected.'.info); });
};



init();
