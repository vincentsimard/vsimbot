'use strict';

var Utils = require('./../Utils.js');

// post FEN to lichess.org
var butts = function(from, to, message, raw, match) {
  if (!(to === '#yummyhat' && from === 'yummyhat')) { return; }
  
  console.message('/butts', to, from);
  console.say(to, message);
};

module.exports.event = 'message#';
module.exports.pattern = "^(butts|boobies)";
module.exports.handler = butts;
