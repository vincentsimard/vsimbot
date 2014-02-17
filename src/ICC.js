var $ = require('cheerio');
var request = require('request');



var ICC = {
  finger: function(handle, callback) {
    var url = 'http://www6.chessclub.com/finger/' + handle;
    var name, groups;

    var parseFingerPage = function(err, response, html) {
      var name, groups;

      if (err) { return console.error(err); }

      var parsedHTML = $.load(html);

      parsedHTML('pre').map(function(i, element) {
        var text = $(element).text();
        var nameRE = /(Name\s\s\s:)\s(.*)/;
        var groupsRE = /(Groups\s:)\s(.*)/;
        var nameMatches, groupsMatches;

        nameMatches = text.match(nameRE);
        groupsMatches = text.match(groupsRE);

        if (nameMatches)   { name   = nameMatches[2]; }
        if (groupsMatches) { groups = groupsMatches[2]; }
      });

      callback(name, groups);
    };

    request(url, parseFingerPage);
  }
};

module.exports = ICC;