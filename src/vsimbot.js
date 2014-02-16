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



var isThisPatrick = function(from, to, message) {
  var messageMatch = message.match(/^is this/i);
  
  if (!to.match(/^[#&]/)) { return; }
  if (!messageMatch) { return; }
  
  bot.say(to, 'No, this is Patrick! KevinTurtle');
};



var printError = function(message) {
  console.error('ERROR: %s: %s', message.command, message.args.join(' '));
};

var printConnect = function() {
  process.stdout.write('*** connecting to ' + config.server + '... ');
};

var printJoin = function (channel, nick, message) {
  if (nick !== config.userName) { return; }

  console.log('*** joined %s', channel);
};



// Handle stdin
process.openStdin().on('data', function(chunk) {
  console.log('' + chunk);
});



bot.connect(function() { console.log('connected.'); });

bot.addListener('connect', printConnect);
bot.addListener('join', printJoin);
bot.addListener('error', printError);

bot.addListener('message', isThisPatrick);



// @TODO: Guess ICC handles real names