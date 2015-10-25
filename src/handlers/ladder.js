'use strict';

var nconf = require('nconf');
var _ = require('underscore');



// Handles ladder registration
// Available commands:
//   - info       prints info on how to use the command
//   - list       prints the list of participants
//   - [handle]   registers player to the ladder
var ladder = function(from, to, message, raw, match) {
  var fullMatch = match[1];
  var command = match[2];
  var handle = fullMatch.split(' ')[0];

  if (fullMatch.length === 0) { return; }

  if (typeof commands[command] !== 'undefined') {
    commands[command](from, to);
  } else {
    register(from, to, handle);
  }
};

var activeLadders = [];
var ladders = {};

var Account = function(twitchName, lichessName) {
  return {
    twitch: twitchName,
    lichess: lichessName
  };
};

var register = function(from, to, handle) {
  if (!isActive(to)) { return; }

  // Check if already in ladder
  if (isInLadder(from, to)) {
    console.say(to, from + ', you are already registered.');
    return;
  }

  if (typeof ladders[to] === 'undefined') { ladders[to] = []; }
  ladders[to].push(new Account(from, handle));

  console.say(to, from + ' has registered to the ladder.');
};

var commands = {
  open: function(from, to) {
    if (!isChannelOwner(from, to)) { return; }
    if (isActive(to)) { return; }

    activeLadders.push(to);

    console.say(to, 'Ladder registration open');
  },

  close: function(from, to) {
    if (!isChannelOwner(from, to)) { return; }
    if (!isActive(to)) { return; }

    activeLadders.splice(activeLadders.indexOf(to), 1);

    console.say(to, 'Ladder registration closed');
  },

  info: function(from, to) {
    var broadcaster = to.replace('#', '');

    console.say(to, 'To join the ' + broadcaster + ' ladder, register by typing "ladder [lichess username]". The list of participants can be viewed by typing "ladder list". If you no longer wish to participate, type "ladder unregister".');
  },

  list: function(from, to) {
    if (!isActive(to)) { return; }
    
    var channelLadder = ladders[to];
    var text = '';
    
    if (typeof channelLadder === 'undefined' || channelLadder.length === 0) {
      text = 'No participants.';
    } else {
      text = 'Participants: ' + _.pluck(channelLadder, 'lichess').join(', ');
    }

    console.say(to, text);
  },

  unregister: function(from, to) {
    ladders[to] = _.filter(ladders[to], function(account) {
      return account.twitch !== from;
    });

    console.say(to, from + ', you are no longer registered.');
  },
};

var isChannelOwner = function(from, to) {
  return '#' + from === to || from === nconf.get('operator');
};

var isActive = function(channel) {
  return activeLadders.indexOf(channel) > -1;
};

var isInLadder = function(from, to) {
  return _.pluck(ladders[to], 'twitch').indexOf(from) > -1;
};



module.exports.event = 'message#';
module.exports.pattern = "^ladder\\s(([^\\s]+)(.*))";
module.exports.handler = ladder;
