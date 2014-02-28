'use strict';



// posts information on an opening based on ECO code
// @TODO: Also do the reverse? Post opening name and ECO based on moves?
var printECO = function(from, to, message, raw, match) {
  var eco = match[2].toUpperCase();
  var ecoList = require('./../data/eco.json');
  var name, moves, text;

  console.message('/eco %s'.input, to, from, eco);

  if (eco in ecoList) {
    name = ecoList[eco][0];
    moves = ecoList[eco][1];

    text = eco + ' ' + name + ': ' + moves;

    // Print name and moves for the ECO
    console.say(to, text);
  }
};



module.exports.event = 'message#';
module.exports.pattern = "(eco)\\s([a-e][0-9]{2})";
module.exports.handler = printECO;
