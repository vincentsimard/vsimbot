var bot;

var Listeners = {
  isThisPatrick: function(from, to, message) {
    var messageMatch = message.match(/^is this/i);
    
    if (!to.match(/^[#&]/)) { return; }
    if (!messageMatch) { return; }
    
    bot.say(to, 'No, this is Patrick! KevinTurtle');
  },

  init: function(ircClient, botConfig) {
    bot = ircClient;

    bot.addListener('message', this.isThisPatrick);
  }
};



module.exports.Listeners = Listeners;
