'use strict';

var ICC = require('./../ICC.js');
var FIDE = require('./../FIDE.js');



// finger icc
var finger = function(from, to, message, raw, match) {
  var handle;

  handle = match[2];
  handle = handle.replace(/[^\w\s-]/gi, ''); // ICC handles must be alphanumeric

  if (isBlacklisted(handle)) { return; }

  console.message('/icc.finger %s'.input, to, from, handle);
  
  var printFinger = function(handle, exists, iccInfo, fideInfo, twitchName) {
    if (!iccInfo)  { iccInfo  = {}; }
    if (!fideInfo) { fideInfo = {}; }

    var text = '"' + handle + '"';
    var titleAndName = '';
    var rating, title, url;

    // Use the FIDE title instead of ICC if possible
    // ICC profiles can take longer to get updated
    if (iccInfo.title)      { title = iccInfo.title; }
    if (fideInfo.titleAbbr) { title = fideInfo.titleAbbr; }

    if (fideInfo.ratings && fideInfo.ratings.std) { rating = fideInfo.ratings.std; }

    titleAndName = (title ? title + ' ' : '') + (iccInfo.name ? iccInfo.name : '');

    switch (exists) {
      case 'public':    text += ' is ' + titleAndName; break;
      case 'known':     text += ' is ' + titleAndName; break;
      case 'suspected': text += ' is allegedly ' + titleAndName; break;
      case 'notpublic': text = 'No public info for "' + handle + '"'; break;
      default: text = '';
    }

    if (rating) { text += ' (FIDE ' + rating + ')'; }
    if (fideInfo.url) { text += ' ' + fideInfo.url; }
    if (twitchName) { text += '. Follow him at http://twitch.tv/' + twitchName; }

    console.say(to, text);
  };

  ICC.finger(handle, function(exists, iccInfo, twitchName) {
    // Not displaying anything if the account doesn't exist
    if (!exists) { return; }

    FIDE.getProfileUrl(iccInfo.name, function(fideProfileUrl) {
      FIDE.getPlayerInfo(fideProfileUrl, function(fideInfo) {
        printFinger(handle, exists, iccInfo, fideInfo, twitchName);
      });
    });
  });
};

var isBlacklisted = function(handle) {
  var words = [
    'black',
    'white',
    'he',
    'she',
    'it',
    'your',
    'better',
    'game',
    'probably',
    'talking',
    'the',
    'this',
    'in',
    'our',
    'gonna',
    'more',
    'playing',
    'that',
    'up',
    'down',
    'out',
    'at'
  ];
  
  handle = handle.toLowerCase();

  return words.indexOf(handle) > -1;
};



module.exports.event = 'message#';
module.exports.pattern = "^(finger|fi|who\\sis|who\\'s)\\s([^\\s]+)";
module.exports.handler = finger;
