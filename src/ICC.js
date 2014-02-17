var cheerio = require('cheerio');
var request = require('request');



var ICC = {
  // @TODO: Print fide/uscf rating? URL to fide profile?
  finger: function(handle, callback) {
    var self = this;
    var url = 'http://www6.chessclub.com/finger/' + handle;

    var parseFingerPage = function(err, response, html) {
      var name, groups, title;

      if (err) { return console.error(err); }

      var $ = cheerio.load(html);

      $('h1 + pre').map(function(i, element) {
        var text = $(element).text();
        var nameRE   = /(Name\s\s\s:)\s(.*)/;
        var groupsRE = /(Groups\s:)\s(.*)/;
        var nameMatches, groupsMatches;

        nameMatches   = text.match(nameRE);
        groupsMatches = text.match(groupsRE);

        if (nameMatches)   { name   = nameMatches[2]; }
        if (groupsMatches) { groups = groupsMatches[2]; }
        title = self.getTitle(groups);
      });

      if (name) {
        self.getFideUrl(name, function(rating, profileUrl) {
          if (callback) { callback(name, title, rating, profileUrl); }
        });
      }
    };

    request(url, parseFingerPage);
  },

  getTitle: function(groups) {
    var title;
    var titleRE = /(GM|IM|FM|WGM|WIM|WFM)s/;
    var matches = groups.match(titleRE);

    if (matches) { title = matches[1]; }

    return title;
  },

  getFideUrl: function(name, callback) {
    var self = this;
    var site = '+site%3Aratings.fide.com%2Fcard.phtml';
    var googleUrl = 'http://google.com/search?q=';
    var url = googleUrl + name + site;

    var parseGooglePage = function(err, response, html) {
      var profileUrl;
      var urlPrefix = 'http://';

      if (err) { return console.error(err); }

      var $ = cheerio.load(html);

      profileUrl = urlPrefix + $('#ires li cite').first().text();

      if (profileUrl === urlPrefix) {
        if (callback) { callback(); }
      } else {
        self.fingerFide(profileUrl, function(rating) {
          if (callback) { callback(rating, profileUrl); }
        });
      }
    };

    request(url, parseGooglePage);
  },

  fingerFide: function(url, callback) {
    var parseFideProfilePage = function(err, response, html) {
      var federation, title, rating;

      if (err) { return console.error(err); }

      var $ = cheerio.load(html);

      $('#middle').map(function(i, element) {
        var text = $(element).text();
        var matches = text.match(/(std.)(\d*)/);
        var ratingRE = /(std.)(\d*)/;
        var ratingMatches;

        ratingMatches  = text.match(ratingRE);

        if (ratingMatches) { rating = ratingMatches[2]; }
      });

      if (callback) { callback(rating); }
    };

    request(url, parseFideProfilePage);
  }
};

module.exports = ICC;