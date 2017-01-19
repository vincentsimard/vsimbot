'use strict';

var cheerio = require('cheerio');
var request = require('request');

var ICC = {
  finger: function(handle, callback) {
    var self = this;
    var url = 'http://www6.chessclub.com/finger/' + handle;

    var parseFinger = function(err, response, html) {
      var exists, name, groups, title, twitchName;
      var lists = ['knownicc', 'suspected'];
      var info = {};

      if (err) { return console.error(err); }

      var $ = cheerio.load(html);

      $('pre').map(function(i, element) {
        var text = $(element).text();

        var lastDisconnectedRE = /\s\(Last\sdisconnected\s(.*)\)\:/;
        var nameRE   = /(Name\s\s\s:)\s(.*)/;
        var groupsRE = /(Groups\s:)\s(.*)/;

        var lastDisconnectedMatches, nameMatches, groupsMatches;

        // We consider that the accound doesn't exist if:
        //   - The handle doesn't match any player
        //   - The handle matches more than one player
        exists = !text.match(/(does\snot\smatch\sany\splayer)|(matches\sat\sleast)/i);

        lastDisconnectedMatches = text.match(lastDisconnectedRE);
        nameMatches   = text.match(nameRE);
        groupsMatches = text.match(groupsRE);

        info.lastDisconnected = lastDisconnectedMatches ? lastDisconnectedMatches[1] : undefined;
        info.online = !info.lastDisconnected;
        info.name   = nameMatches ? nameMatches[2] : undefined;
        info.groups = groupsMatches ? groupsMatches[2] : undefined;
        info.title  = self.getTitle(info.groups);

        // Mixing boolean and string enum is not great (current values: true, false, public, knownicc, knownchesscom, suspected)
        if (exists) { exists = info.name ? 'public' : 'notpublic'; }
      });

      if (!info.name) {
        for (var i = 0; i < lists.length; i++) {
          info.name = self.lookupPlayer(handle, lists[i]);

          if (info.name) {
            exists = lists[i];
            break;
          }
        }
      }

      info.url = url;

      twitchName = self.lookupPlayer(handle, 'twitch');

      callback && callback(exists, info, twitchName);
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
  },

  lookupPlayer: function(handle, list) {
    var players = require('./data/' + list + '.json');

    handle = handle.toLowerCase();

    if (handle in players) { return players[handle]; }
  }
};

module.exports = ICC;