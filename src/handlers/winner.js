"use strict";

var nconf = require('nconf');

var winner = function(from, to, message, raw, match) {
  if (to !== "#amazingoid" || true) { return; }
  if (!(from === nconf.get('operator') || '#' + from === to)) { return; }

  console.message("/!winner".input, to, from);

  console.say(to, "/me And the winner is...");
  console.say(to, "/me !!! amazingoid !!! (Amazingoid does not follow this channel.)");
};



module.exports.event = "message#";
module.exports.pattern = "^!winner";
module.exports.handler = winner;
