'use strict';



// posts information on an opening based on ECO code
// @TODO: Also do the reverse? Post opening name and ECO based on moves?
var printECO = function(from, to, message, raw, match) {
  var eco = match[2];

  console.message('/eco %s'.input, to, from, eco);

  // @TODO: Print name and moves for the ECO  
  console.log(eco);

  // console.say(to, text);
};



module.exports.event = 'message#';
module.exports.pattern = "^(eco)\\s([a-z][0-9]{2})";
module.exports.handler = printECO;
