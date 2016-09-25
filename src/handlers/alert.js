'use strict';

var nconf = require('nconf');
var _ = require('underscore');
var ICC = require('./../ICC.js');

// @TODO: CLI command to list all watches
// @TODO: Restrict the number of watch handlers?

var intervals = [];

// polls icc and prints when the user goes online/offline
var watch = function(from, to, message, raw, match) {
  // restricted to channel owner only (and bot operator)
  if (!(from === nconf.get('operator') || '#' + from === to)) { return; }
  
  var handle;

  handle = match[2];
  handle = handle.replace(/[^\w\s-]/gi, ''); // ICC handles must be alphanumeric

  console.message('/alert %s'.input, to, from, handle);

  var watched = _.where(intervals, { channel: to, handle: handle });
  var isWatched = !!watched.length;

  if (isWatched) {
    removeAlert(to, handle, watched.io);
  } else {
    addAlert(to, handle);
  }
};

var addAlert = function(to, handle) {
  ICC.finger(handle, function(exists, iccInfo, twitchName) {
    if (!exists) { return; }

    console.say(to, 'Alerts for "' + handle + '" enabled');

    var previous = iccInfo.online;

    // poll icc
    var intervalObj = setInterval(function() {
      ICC.finger(handle, function(exists, iccInfo, twitchName) {
        if (previous !== iccInfo.online) {
          console.say(to, '"' + handle + '" is ' + (iccInfo.online ? 'online' : 'offline'));

          previous = iccInfo.online;
        }
      });
    }, 60000); // @TODO: Move poll interval to config?

    intervals.push({ channel: to, handle: handle, io: intervalObj });
  });
};

var removeAlert = function(to, handle, intervalObj) {
  clearInterval(intervalObj);

  intervals = _.reject(intervals, function(element) {
    return element.channel === to && element.handle === handle;
  });

  console.say(to, 'Alerts for "' + handle + '" disabled');
};



module.exports.event = 'message#';
module.exports.pattern = "^(alert)\\s([^\\s]+)";
module.exports.handler = watch;
