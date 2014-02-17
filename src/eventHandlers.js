var handlers = {
  error: function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
  },

  connect: function() {
    process.stdout.write('*** connecting... ');
  },

  join: function (channel, nick, message, callback) {
    // if (nick !== config.userName) { return; }
    if (nick !== 'vsimbot') { return; }

    console.log('*** joined %s', channel);
  }
};



module.exports.handlers = handlers;
