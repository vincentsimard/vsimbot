'use strict';

var cheerio = require('cheerio');
var request = require('request');
var _ = require('underscore');



var Chesscom = {
  getProfileUrl: function(handle) {
    if (!handle) { return; }

    return 'http://chess.com/members/view/' + handle;
  },

  getPlayerInfo: function(handle, callback) {
    var self = this;
    var url = this.getProfileUrl(handle);

    if (typeof handle === 'undefined') {
      callback && callback();
      return;
    }

    var parseProfile = function(err, response, html) {
      if (err) { return console.error(err); }

      var $ = cheerio.load(html);
      var title = $('title').text().toLowerCase();
      var exists = true;
      var info = {};

      var getRatingByClassName = function(className) {
        // @TODO: This traversing is a bit silly
        return $('.ratings ' + className).parent().parent().find('div.right').first().text().trim();
      };

      if (title === 'members - chess.com') { exists = false; }
      if (title === 'account closed - chess.com') { exists = false; }
      // if (title === 'member: ' + handle + ' - chess.com') { exists = true; }

      if (exists) {
        info.name = $('h1.user-profile-title + p > strong').text().trim();
        info.title = $('h1.user-profile-title a[href="/members/titled_players"]').text().trim();
        info.country = $('.user-left-sidebar .flag').attr('title');
        info.location = $('.user-left-sidebar .bottom-12').text().trim();

        info.ratings = {};
        info.ratings.std = getRatingByClassName('.standard-chess');
        info.ratings.blitz = getRatingByClassName('.blitz-chess');
        info.ratings.bullet = getRatingByClassName('.bullet-chess');
        info.ratings.chess960 = getRatingByClassName('.c960');
        info.ratings.online = getRatingByClassName('.chess-play-email');
        info.ratings.tactics = getRatingByClassName('.trainer');
        info.ratings.mentor = getRatingByClassName('.conditional');
      }

      info.url = url;

      callback && callback(exists, info);
    };

    request.get(url, parseProfile);
  }
};

module.exports = Chesscom;