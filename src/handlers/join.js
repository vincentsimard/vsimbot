var nconf = require('nconf');

// join/part channel and save to config
var channelAction = function(from, message, raw, match) {
  var to = '#' + nconf.get('userName');
  var action = match[1];
  var channel = '#' + from;

  // @TODO: Allow users to specify which channel to join?
  // channel = match[3].length ? '#' + match[3] : channel;

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

  global.ircClient[action](channel);
  console.say(to, action + 'ing ' + channel);
};



module.exports.event = 'message#' + nconf.get('userName');

module.exports.listener = function(from, message) {
  var pattern = "^(join|part)\\s?(#?(\\w*))?";
  var args = Array.prototype.slice.call(arguments, 0);
  var match = message.match(new RegExp(pattern, "i"));

  if (match) {
    args.push(match);
    channelAction.apply(this, args);
  }
};
