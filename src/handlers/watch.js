'use strict';

var nconf = require('nconf');
var _ = require('underscore');
var ICC = require('./../ICC.js');

// @TODO: Way to disable a watch
// @TODO: CLI command to list all watches
// @TODO: Restrict the number of watch handlers?

var intervals = [];

// polls icc and prints when the user goes online/offline
var watch = function(from, to, message, raw, match) {
  // Restrict to channel owner only (and bot operator)
  if (!(from === nconf.get('operator') || '#' + from === to)) { return; }
  
  var handle;

  handle = match[2];
  handle = handle.replace(/[^\w\s-]/gi, ''); // ICC handles must be alphanumeric

  console.message('/watch %s'.input, to, from, handle);

  var watched = _.where(intervals, { handle: handle, channel: to });
  var isWatched = !!watched.length;

  if (isWatched) {
    removeAlert(to, handle, watched.id);
  } else {
    addAlert(to, handle);
  }
};

var addAlert = function(to, handle) {
  console.say(to, 'Alerts for "' + handle + '" enabled');

  ICC.finger(handle, function(exists, iccInfo, twitchName) {
    if (!exists) { return; }

    var previous = iccInfo.online;

    // poll icc
    var id = setInterval(function() {
      ICC.finger(handle, function(exists, iccInfo, twitchName) {
        if (previous !== iccInfo.online) {
          console.say(to, '"' + handle + '" is ' + (iccInfo.online ? 'online' : 'offline'));

          previous = iccInfo.online;
        }
      });
    }, 60000);

    intervals.push({ id: id, handle: handle, channel: to });
  });
};

var removeAlert = function(to, handle, id) {
  clearInterval(id);
  intervals = _.reject(intervals, function(element) { return element.id === id; });

  console.say(to, 'Alerts for "' + handle + '" disabled');
};



module.exports.event = 'message#';
module.exports.pattern = "^(watch)\\s([^\\s]+)";
module.exports.handler = watch;
