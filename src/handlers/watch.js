'use strict';

var nconf = require('nconf');
var ICC = require('./../ICC.js');

// @TODO: Way to disable a watch
// @TODO: CLI command to list all watches
// @TODO: Restrict the number of watch handlers?


// polls icc and prints when the user goes online/offline
var watch = function(from, to, message, raw, match) {
  // Restrict to channel owner only
  if (!(from === nconf.get('operator') || '#' + from === to)) { return; }
  
  var handle;

  handle = match[2];
  handle = handle.replace(/[^\w\s-]/gi, ''); // ICC handles must be alphanumeric

  console.message('/watch %s'.input, to, from, handle);
  console.say(to, 'Alerts for "' + handle + '" activated');

  ICC.finger(handle, function(exists, iccInfo, twitchName) {
    if (!exists) { return; }

    var previous = iccInfo.online;

    // poll icc
    setInterval(function() {
      ICC.finger(handle, function(exists, iccInfo, twitchName) {
        if (previous !== iccInfo.online) {
          console.say(to, '"' + handle + '" is ' + (iccInfo.online ? 'online' : 'offline'));

          previous = iccInfo.online;
        }
      });
    }, 60000);
  });
};



module.exports.event = 'message#';
module.exports.pattern = "^(watch)\\s([^\\s]+)";
module.exports.handler = watch;
