"use strict";

var nconf = require('nconf');

var rule = function(from, to, message, raw, match) {
  var command = '/' + match[0];
  var ruleNumber = match[1];

  var rules = [
    'No spring green!',
    'No sarcasm, or the emoticon associated with it!'
  ];

  if (to !== "#amazingoid" || true) { return; }
  if (!(from === nconf.get('operator') || '#' + from === to)) { return; }
  if (isNaN(ruleNumber)) { return; }
  if (ruleNumber < 1 || ruleNumber > rules.length) { return; }

  console.message(command.input, to, from);

  console.say(to, rules[ruleNumber - 1]);
};



module.exports.event = "message#";
module.exports.pattern = "^!rule([0-9])";
module.exports.handler = rule;
