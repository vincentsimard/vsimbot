'use strict';

var nconf = require('nconf');
var _ = require('underscore');

var Chesscom = require('./../Chesscom.js');



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
  var handle = fullMatch.split(' ')[0];

  if (fullMatch.length === 0) { return; }

  if (typeof commands[command] !== 'undefined') {
    commands[command](from, to);
  } else {
    addChallenger(from, to, handle);
  }
};

var activeQueues = [];
var queues = {};

var Account = function(twitchName, chessName) {
  return {
    twitch: twitchName,
    chess: chessName
  };
};

var addChallenger = function(from, to, handle) {
  if (!isActive(to)) { return; }

  // Check if already in queue
  if (isInQueue(from, to)) {
    console.say(to, from + ', you are already in the queue.');
    return;
  }

  // Check for a valid chess.com account
  accountExists(handle, function(exists) {
    if (!exists) {
      console.say(to, from + ', ' + handle + ' is not a valid chess.com account.');
      return;
    }

    if (typeof queues[to] === 'undefined') { queues[to] = []; }
    queues[to].push(new Account(from, handle));
  
    console.say(to, from + ', you have been added to the queue.');
  });
};

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
    if (isChannelOwner(from, to)) {
      this.clearQueue(to);
    } else {
      this.clearChallenger(from, to);
    }
  },

  clearChallenger: function(from, to) {
    queues[to] = _.filter(queues[to], function(account) {
      return account.twitch !== from;
    });

    console.say(to, from + ', you have been removed from the queue.');    

    // channelQueue = _.without(channelQueue, _.findWhere(channelQueue, { twitch: from }));
  },

  clearQueue: function(to) {
    queues[to] = [];

    console.say(to, 'Challenge queue cleared.');
  },

  info: function(from, to) {
    var broadcaster = to.replace('#', '');

    console.say(to, 'To play against ' + broadcaster + ', join the queue by typing "challenge [username]" where [username] is your chess.com account name. The current queue can viewed by typing "challenge queue".');
  },

  queue: function(from, to) {
    if (!isActive(to)) { return; }
    
    var channelQueue = queues[to];
    var text = '';
    
    if (typeof channelQueue === 'undefined' || channelQueue.length === 0) {
      text = 'The challenger queue is empty.';
    } else {
      text = 'Challenger queue: ' + _.pluck(channelQueue, 'twitch').join(', ');
    }

    console.say(to, text);
  },

  next: function(from, to) {
    if (!isChannelOwner(from, to)) { return; }
    if (!isActive(to)) { return; }

    if (queues[to].length === 0) {
      console.say(to, 'There is no one in the queue.');
      return;
    }

    var nextChallenger = queues[to][0];

    console.say(to, 'Next challenger: ' + nextChallenger.twitch + ' - http://chess.com/members/view/' + nextChallenger.chess);

    queues[to].shift();
  }
};

var isChannelOwner = function(from, to) {
  return '#' + from === to || from === nconf.get('operator');
};

var isActive = function(channel) {
  return activeQueues.indexOf(channel) > -1;
};

var isInQueue = function(from, to) {
  return _.pluck(queues[to], 'twitch').indexOf(from) > -1;
};

var accountExists = function(handle, callback) {
  Chesscom.getPlayerInfo(handle, function(exists, chesscomInfo) {
    callback(exists);
  });
};



module.exports.event = 'message#';
module.exports.pattern = "^challenge\\s(([^\\s]+)(.*))";
module.exports.handler = challenge;
