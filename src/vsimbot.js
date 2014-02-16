#!/usr/bin/env node

'use strict';

var irc = require('irc');
var fs = require('fs');
var nconf = require('nconf');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();

var bot = new irc.Client(config.server, config.userName, config);

bot.connect(function() {
  console.log('connected.');
});

bot.addListener('connect', function() {
  process.stdout.write('*** connecting to ' + config.server + '... ');
});

bot.addListener('join', function (channel, nick, message) {
  if (nick !== config.userName) { return; }

  console.log('*** joined %s', channel);
});

bot.addListener('error', function(message) {
  console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

bot.addListener('message#vsim', function (from, message) {
  console.log('<%s> %s', from, message);
});
