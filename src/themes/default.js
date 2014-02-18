/*
Available colors/styles:
  bold
  italic
  underline
  inverse
  yellow
  cyan
  white
  magenta
  green
  red
  grey
  blue
  rainbow
  zebra
  random
*/

defaultTheme = {
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  info: 'green',
  input: 'white',
  irc: 'grey',
  help: 'cyan',
  timestamp: 'yellow'
};

var addTimestamp = function() {
  var oldLog = console.log.bind(console);
  console.log = function() {
    if (!arguments.length) { return; }

    var ts = '['+new Date().toISOString().slice(11,-5)+']';

    arguments[0] = ts.timestamp + ' ' + arguments[0];

    return oldLog.apply(console, arguments);
  };
};



addTimestamp();

module.exports = defaultTheme;