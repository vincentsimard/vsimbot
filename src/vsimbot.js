#!/usr/bin/env node

'use strict';

var irc = require('irc');

// Configuration
var config = {
  server: 'irc.twitch.tv',
  nick: 'vsimbot',
  options: {
    channels: ['#vsim'],
    userName: 'vsimbot',
    realName: 'vsimbot',
    
    port: 6667,
    debug: false,
    showErrors: false,
    autoRejoin: true,
    autoConnect: false,
    secure: false,
    selfSigned: false,
    certExpired: false,
    floodProtection: true,
    floodProtectionDelay: 1000,
    sasl: false,
    stripColors: false,
    channelPrefixes: "&#",
    messageSplit: 512
  }
};

var bot = new irc.Client(config.server, config.nick, config.options);

bot.connect(function() {
  console.log('%s connected.\n', config.nick);
});

bot.addListener('connect', function() {
  console.log('%s connecting...', config.nick);
});

bot.addListener('error', function(message) {
  console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

bot.addListener('message#vsim', function (from, message) {
  console.log('<%s> %s', from, message);
});
