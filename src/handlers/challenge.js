'use strict';

var nconf = require('nconf');
var _ = require('underscore');



// Handles queue of challengers
// Available commands:
//   - on         enables challenges
//   - off        disables challenges
//   - clear      clears the queue
//   - info       prints info on how to use the command
//   - queue      prints the current queue
//   - next       removes one player from the queue and prints the next one
//   - [handle]   adds player to the queue
var challenge = function(from, to, message, raw, match) {
  var fullMatch = match[1];
  var command = match[2];

  if (fullMatch.length === 0) { return; }

  if (typeof commands[command] !== 'undefined') {
    console.log(command);
    commands[command](from, to);
  } else {
    // Handle joining the queue
  }
};

var activeQueues = ['#vsimbot'];
var queues = {
  '#vsimbot': [
    {'twitch': 'vsim', 'chess': 'vsim'},
    {'twitch': 'amazingoid', 'chess': 'chesskid'}
  ]
};

var Account = function(twitchName, chessName) {
  return {
    twitch: twitchName,
    chess: chessName
  };
}

var commands = {
  on: function(from, to) {
    if (!isChannelOwner(from, to)) { return; }
    if (isActive(to)) { return; }

    activeQueues.push(to);

    console.say(to, 'Challenges enabled');
  },

  off: function(from, to) {
    if (!isChannelOwner(from, to)) { return; }
    if (!isActive(to)) { return; }

    activeQueues.splice(activeQueues.indexOf(to), 1);

    console.say(to, 'Challenges disabled');
  },

  clear: function(from, to) {
    if (!isChannelOwner(from, to)) { return; }

    queues[to] = [];

    console.say(to, 'Challenge queue cleared.');
  },

  info: function(from, to) {
    var broadcaster = to.replace('#', '');

    console.say(to, 'To play against ' + broadcaster + ', join the queue by typing "challenge [username]" where [username] is your chess.com account name. The current queue can viewed by typing "challenge queue".');
  },

  queue: function(from, to) {
    var channelQueue = queues[to];
    var text = '';

    // @TODO: Allow the command when challenges are inactive?
    if (!isActive(to)) { return; }

    if (typeof channelQueue === 'undefined' || channelQueue.length === 0) {
      text = 'The challenger queue is empty.';
    } else {
      text = 'Challenger queue: ' + _.pluck(channelQueue, 'twitch').join(', ');
    }

    console.say(to, text);
  },

  next: function(from, to) {
    if (!isChannelOwner(from, to)) { return; }
  }
};

var isChannelOwner = function(from, to) {
  return '#' + from === to || from === nconf.get('operator');
};

var isActive = function(channel) {
  return activeQueues.indexOf(channel) > -1;
};



module.exports.event = 'message#';
module.exports.pattern = "^challenge\\s(([^\\s]+)(.*))";
module.exports.handler = challenge;
