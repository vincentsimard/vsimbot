'use strict';

var cheerio = require('cheerio');
var request = require('request');

var Utils = require('./Utils.js');

// @TODO: This module is a mess
// @TODO: Manually lookup some known players

var ICC = {
  finger: function(handle, callback) {
    var self = this;
    var url = 'http://www6.chessclub.com/finger/' + handle;

    var parseFingerPage = function(err, response, html) {
      var name, groups, title, exists;

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

        if (nameMatches)   { name   = nameMatches[2]; }
        if (groupsMatches) { groups = groupsMatches[2]; }
        title = self.getTitle(groups);
      });

      self.getFideUrl(name, function(rating, profileUrl) {
        if (callback) { callback(exists, name, title, rating, profileUrl); }
      });
    };

    request.get(url, parseFingerPage);
  },

  getTitle: function(groups) {
    if (typeof groups === 'undefined') { return ''; }

    var title;
    var titleRE = /(GM|IM|FM|WGM|WIM|WFM)s/;
    var matches = groups.match(titleRE);

    if (matches) { title = matches[1]; }

    return title;
  },

  // Note: using 'site:ratings.fide'.com instead of
  //       'site:ratings.fide/card.phtml?event'. In some cases, google doesn't
  //       have the profile page in the results so we use the id from another
  //       related fide page and manually build the profile page url
  //       (e.g.: Andrei Valeryevich Rychagov)
  getFideUrl: function(name, callback) {
    if (!name) { callback(); return; }

    var self = this;
    var site = '+site%3Aratings.fide.com';
    var googleQueryUrl = 'http://google.com/search?q=';
    var url = googleQueryUrl + name + site;

    var parseGooglePage = function(err, response, html) {
      if (err) { return console.error(err); }

      var id, googleResultUrl, profileUrl;
      var profileBaseUrl = 'http://ratings.fide.com/card.phtml?event=';
      var $ = cheerio.load(html);

      var getId = function(url) {
        var fideUrl = Utils.getParameterByName(url, 'q');
        var id;

        id = Utils.getParameterByName(fideUrl, 'event'); // Profile card page (expected)
        if (!id) { id = Utils.getParameterByName(fideUrl, 'id'); } // View games page
        if (!id) { id = Utils.getParameterByName(fideUrl, 'idnumber'); } // Individual calculations page

        return id;
      };

      googleResultUrl = $('#ires li h3 > a').first().attr('href');
      id = getId(googleResultUrl);

      if (!id.length) {
        if (callback) { callback(); }
      } else {
        profileUrl = profileBaseUrl + id;

        self.fingerFide(profileUrl, function(rating) {
          if (callback) { callback(rating, profileUrl); }
        });
      }
    };

    request.get(url, parseGooglePage);
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

    request.get(url, parseFideProfilePage);
  }
};

module.exports = ICC;