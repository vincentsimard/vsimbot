'use strict';

var nconf = require('nconf');
var client = require('./../Client.js');



var isTwitch = function(raw) {
  return raw.host && raw.host.indexOf("twitch.tv") >= 0;
}

// join/part channel and save to config
var channelAction = function(from, message, raw, match) {
  if (!isTwitch(raw)) { return; }

  var to = '#' + nconf.get('userName');
  var action = match[1];
  var channel = '#' + from;

  console.message('/%s %s'.input, to, from, action, channel);

  var channelsAfter = {
    join: function(channel) {
      var channels = nconf.get('channels');

      if (channels.indexOf(channel) < 0) {
        channels.push(channel);
      }

      return channels;
    },

    part: function(channel) {
      var channels = nconf.get('channels');

      channels = channels.filter(function(value) {
        return value !== channel;
      });

      return channels;
    }
  };

  nconf.set('channels', channelsAfter[action](channel));
  nconf.save(function(err) {
    if (err) { return console.error(err); }
  });

  // @TODO: Crashes when action is part and the bot is not in the channel
  client.irc[action](channel);
  console.say(to, action + 'ing ' + channel, raw);
};



module.exports.event = 'message#' + nconf.get('userName');
module.exports.pattern = "^(join|part)\\s?(#?(\\w*))?";
module.exports.handler = channelAction;

