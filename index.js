#!/usr/bin/env node

'use strict';

// @TODO: Manage challenger queue
// @TODO: Log network connection loss/disconnections

var nconf = require('nconf');
var colors = require('colors');

var client = require('./src/Client.js');
var cli = require('./src/CLI.js');
var handlers = require('./src/EventHandlers.js');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();

// @TODO: Move theme init to separate module?
var loadTheme = function(name) {
  var THEME_PATH = __dirname + '/src/themes/';

  if (typeof name === 'undefined') { name = 'default'; }

  colors.setTheme(THEME_PATH + name + '.js');
};

var init = function() {
  loadTheme(config.theme);

  // @TODO: Initialize modules in a cleaner way... maybe?
  cli.init();
  handlers.init();

  client.connect(function() { console.log('*** connected.'.info); });
};



init();
