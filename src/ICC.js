'use strict';

var cheerio = require('cheerio');
var request = require('request');

// @TODO: This module is a mess
// @TODO: Manually lookup some known players

var ICC = {
  finger: function(handle, callback) {
    var self = this;
    var url = 'http://www6.chessclub.com/finger/' + handle;

    var parseFinger = function(err, response, html) {
      var exists, name, groups, title;
      var info = {};

      if (err) { return console.error(err); }

      var $ = cheerio.load(html);

      $('h1 + pre').map(function(i, element) {
        var text = $(element).text();
        var nameRE   = /(Name\s\s\s:)\s(.*)/;
        var groupsRE = /(Groups\s:)\s(.*)/;

        var nameMatches, groupsMatches;

        // We consider that the accound doesn't exist if:
        //   - The handle doesn't match any player
        //   - The handle matches more than one player
        exists = !text.match(/(does\snot\smatch\sany\splayer)|(matches\sat\sleast)/i);

        nameMatches   = text.match(nameRE);
        groupsMatches = text.match(groupsRE);

        info.name   = nameMatches ? nameMatches[2] : undefined;
        info.groups = groupsMatches ? groupsMatches[2] : undefined;
        info.title  = self.getTitle(info.groups);
      });

      // @TODO: Return an object with all fields from finger instead?
      // callback && callback(exists, name, title);
      callback && callback(exists, info);
    };

    request.get(url, parseFinger);
  },

  getTitle: function(groups) {
    if (typeof groups === 'undefined') { return; }

    var title;
    var titleRE = /(GM|IM|FM|WGM|WIM|WFM)s/;
    var matches = groups.match(titleRE);

    if (matches) { title = matches[1]; }

    return title;
  }
};

module.exports = ICC;