'use strict';

var cheerio = require('cheerio');
var request = require('request');



var Lichess = {
  getProfileUrl: function(handle) {
    if (!handle) { return; }

    return 'http://lichess.org/@/' + handle;
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
      var data = {};

      data.exists = response.statusCode < 400;
      data.url = url;
      data.warnings = $('.user-infos .warning').length > 0;

      // @TODO: Parse other info? Language, notes, ratings, etc.

      callback && callback(data);
    };

    request.get(url, parseProfile);
  }
};

module.exports = Lichess;