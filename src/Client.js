'use strict';

var irc = require('irc');
var nconf = require('nconf');

var config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' })
  .get();

var client = new irc.Client(config.server, config.userName, config);

module.exports = client;