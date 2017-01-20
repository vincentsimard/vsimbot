'use strict';

var irc = require('irc');
var Discord = require('discord.js');
var nconf = require('nconf');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();

var client = {};
client.irc = new irc.Client(config.server, config.userName, config);
client.discord = new Discord.Client();

module.exports = client;