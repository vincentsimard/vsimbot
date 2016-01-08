'use strict';

var cheerio = require('cheerio');
var request = require('request');

var Utils = require('./Utils.js');

var FIDE = {
  // Note: using 'site:ratings.fide'.com instead of
  //       'site:ratings.fide/card.phtml?event'. In some cases, google doesn't
  //       have the profile page in the results so we use the id from another
  //       related fide page and manually build the profile page url
  //       (e.g.: Andrei Valeryevich Rychagov)
  getProfileUrl: function(name, callback) {
    if (!name) {
      callback && callback();
      return;
    }

    var site = '+site%3Aratings.fide.com';
    var googleQueryUrl = 'http://google.com/search?q=';
    var url = googleQueryUrl + name + site;

    var parseGoogleResults = function(err, response, html) {
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

      googleResultUrl = $('#ires h3 > a').first().attr('href');

      id = getId(googleResultUrl);

      if (id.length) { profileUrl = profileBaseUrl + id; }

      callback && callback(profileUrl);
    };

    request.get(url, parseGoogleResults);
  },

  getPlayerInfo: function(url, callback) {
    var self = this;

    if (typeof url === 'undefined') {
      callback && callback();
      return;
    }

    var parseProfile = function(err, response, html) {
      if (err) { return console.error(err); }

      var $ = cheerio.load(html);
      var info = {};
      var infoHtml, infoRows;

      var getValue = function(row) {
        return row.find('td').eq(1).text().trim();
      };

      var translateRatings = function(ratings) {
        var stdMatch   = ratings.match(/(std\.)(\d*)/);
        var rapidMatch = ratings.match(/(rapid)(\d*)/);
        var blitzMatch = ratings.match(/(blitz)(\d*)/);

        return {
          'std':   stdMatch   ? stdMatch[2]   : undefined,
          'rapid': rapidMatch ? rapidMatch[2] : undefined,
          'blitz': blitzMatch ? blitzMatch[2] : undefined
        };
      };

      // Remove the cell with the player picture to keep things consistent
      $('td[background]').remove();

      infoHtml = $('#middle .contentpaneopen table[width="480"][height="10"]');
      infoRows = infoHtml.children('tr');

      info.name       = getValue(infoRows.eq(0));
      info.federation = getValue(infoRows.eq(1));
      info.title      = getValue(infoRows.eq(2));
      info.ratings    = getValue(infoRows.eq(3));
      info.bYear      = getValue(infoRows.eq(4));
      info.sex        = getValue(infoRows.eq(5));

      info.ratings    = translateRatings(info.ratings);
      info.titleAbbr  = self.getTitleAbbr(info.title);
      
      info.url = url;

      callback && callback(info);
    };

    request.get(url, parseProfile);
  },

  getTitleAbbr: function(title) {
    var abbr = '';

    // Known titles on FIDE.com
    // There might be more or spelling variations
    switch(title) {
      case 'Grand Master':           abbr = 'GM'; break;
      case 'International Master':   abbr = 'IM'; break;
      case 'FIDE Master':            abbr = 'FM'; break;
      case 'Candidate Master':       abbr = 'CM'; break;
      case 'Woman Grand Master':     abbr = 'WGM'; break;
      case 'Woman Intl. Master':     abbr = 'WIM'; break;
      case 'Woman FIDE Master':      abbr = 'WFM'; break;
      case 'Woman Candidate Master': abbr = 'WCM'; break;
    }

    return abbr;
  }
};

module.exports = FIDE;