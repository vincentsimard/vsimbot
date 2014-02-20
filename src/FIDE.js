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

    var self = this;
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

      googleResultUrl = $('#ires li h3 > a').first().attr('href');
      id = getId(googleResultUrl);

      if (id.length) { profileUrl = profileBaseUrl + id; }

      callback && callback(profileUrl);
    };

    request.get(url, parseGoogleResults);
  },

  getPlayerInfo: function(url, callback) {
    if (typeof url === 'undefined') {
      callback && callback();
      return;
    }

    var parseProfile = function(err, response, html) {
      if (err) { return console.error(err); }

      var $ = cheerio.load(html);
      var info, infoHtml, infoRows;

      var getValue = function(row) {
        return row.find('td').eq(1).text().trim();
      };

      var translateRatings = function(ratings) {
        var std = ratings.match(/(std\.)(\d*)/);
        var rapid = ratings.match(/(rapid)(\d*)/);
        var blitz = ratings.match(/(blitz)(\d*)/);

        var translated = {
          'std': std ? std[2] : undefined,
          'rapid': rapid ? rapid[2] : undefined,
          'blitz': blitz ? blitz[2] : undefined
        };

        return translated;
      };

      // Remove the cell with the player picture to keep things consistent
      $('td[background]').remove();

      info = {};
      infoHtml = $('#middle .contentpaneopen table[width="480"][height="10"]');
      infoRows = infoHtml.children('tr');

      info['name']       = getValue(infoRows.eq(0));
      info['federation'] = getValue(infoRows.eq(1));
      info['title']      = getValue(infoRows.eq(2));
      info['ratings']    = translateRatings(getValue(infoRows.eq(3)));
      info['bYear']      = getValue(infoRows.eq(4));
      info['sex']        = getValue(infoRows.eq(5));
      
      callback && callback(info);
    };

    request.get(url, parseProfile);
  }
};

module.exports = FIDE;