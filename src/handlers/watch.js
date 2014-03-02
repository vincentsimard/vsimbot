'use strict';

var ICC = require('./../ICC.js');



// polls icc and prints when the user goes online/offline
var watch = function(from, to, message, raw, match) {
  var handle;

  handle = match[2];
  handle = handle.replace(/[^\w\s-]/gi, ''); // ICC handles must be alphanumeric

  console.message('/watch %s'.input, to, from, handle);

  ICC.finger(handle, function(exists, iccInfo, twitchName) {
    if (!exists) { return; }

    var previous = iccInfo.online;

    // poll icc
    setInterval(function() {
      ICC.finger(handle, function(exists, iccInfo, twitchName) {
        if (previous !== iccInfo.online) {
          console.log('"' + handle + '" is ' + (iccInfo.online ? 'online' : 'offline'));

          previous = iccInfo.online;
        }
      });
    }, 60000);
  });
};



module.exports.event = 'message#';
module.exports.pattern = "^(watch)\\s([^\\s]+)";
module.exports.handler = watch;
