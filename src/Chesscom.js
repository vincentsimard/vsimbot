'use strict';

var cheerio = require('cheerio');
var request = require('request');
var _ = require('underscore');



var Chesscom = {
  getProfileUrl: function(handle) {
    if (!handle) { return; }

    return 'http://chess.com/member/' + handle;
  },

  getPlayerInfo: function(handle, callback) {
    var self = this;
    var lists = ['knownchesscom'];
    var url = this.getProfileUrl(handle);

    if (typeof handle === 'undefined') {
      callback && callback();
      return;
    }

    var parseProfile = function(err, response, html) {
      if (err) { return console.error(err); }

      var $ = cheerio.load(html);
      var exists = false;
      var info = {};
      var statusCode = response.statusCode;

      if (statusCode >= 200 && statusCode < 300) { exists = true; }

      if (exists) {
        info.name = $('.profile-card .overview .details div:first-of-type').text().trim();
        info.title = $('.profile-card .overview h2 .user-chess-title').text().trim();
        info.country = $('.country-flag').attr('tip');

        // Mixing boolean and string enum is not great (current values: true, false, public, knownicc, knownchesscom, suspected)
        if (exists) { exists = info.name ? 'public' : 'notpublic'; }
      }

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

      callback && callback(exists, info);
    };

    request.get(url, parseProfile);
  },

  lookupPlayer: function(handle, list) {
    var players = require('./data/' + list + '.json');

    handle = handle.toLowerCase();

    if (handle in players) { return players[handle]; }
  }
};

module.exports = Chesscom;