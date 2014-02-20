'use strict';

var cheerio = require('cheerio');
var request = require('request');

// @TODO: This module is a mess
// @TODO: Manually lookup some known players
// @TODO: Move known players to JSON file

var ICC = {
  finger: function(handle, callback) {
    var self = this;
    var url = 'http://www6.chessclub.com/finger/' + handle;

    var parseFinger = function(err, response, html) {
      var exists, name, groups, title;
      var manualLists = ['Known', 'Suspected'];
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

        if (exists) { exists = 'public'; }

        nameMatches   = text.match(nameRE);
        groupsMatches = text.match(groupsRE);

        info.name   = nameMatches ? nameMatches[2] : undefined;
        info.groups = groupsMatches ? groupsMatches[2] : undefined;
        info.title  = self.getTitle(info.groups);
      });

      for (var i = 0; i < manualLists.length; i++) {
        info.name = self['lookupPlayer' + manualLists[i]](handle);

        if (info.name) {
          exists = manualLists[i].toLowerCase();
          break;
        }
      }

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
  },

  lookupPlayer: function(handle, list) {
    handle = handle.toLowerCase();

    if (handle in list) { return list[handle]; }
  },

  lookupPlayerKnown: function(handle) {
    // Non-public handles with their names in notes
    var known = {
      'leverage': 'Andrey Kalinichev',
      'alias': 'Roman Zhenetl',
      'ubiyca': 'Teimour Radjabov',
      'hawkeye': 'Roland Schmaltz',
      'ricardov': 'Ricardo Bedin Franca',
      'silencio': 'Alexandre Simone',
      'nfork': 'Jari Jarvenpaa',
      'sengir': 'Vinay Bhat',
      'karpov': 'Anatoly Karpov',
      'lalu': 'Arun Sharma'
    };

    return this.lookupPlayer(handle, known);
  },

  lookupPlayerSuspected: function(handle) {
    // Non-public handles with allegedly known owners
    var suspected = {
      'picachu': 'Rogelio Barcenilla',
      'blitzmaniac': 'Gopal S Menon',
      'firetiger': 'Igor Sorkin',
      'viscaelbarca': 'Viswanathan Anand',
      'vidocq': 'Boris Grachev',
      'rafaello': 'Sergey Karjakin',
      'sarcasmgunnel': 'Magnus Carlsen',
      'thetwits': 'Magnus Carlsen',
      'duhwinning': 'Magnus Carlsen',
      'cfaceindisguise': 'Magnus Carlsen',
      'foster': 'Wesley So',
      'tintirito': 'Tigran L. Petrosian',
      'tigrano': 'Tigran L. Petrosian',
      'talion': 'Gata Kamsky',
      'wunjin': 'Levon Aronian',
      'egorgeroev-2': 'Alexander Morozevich',
      'andreagassi': 'Alexander Morozevich',
      'derfel': 'David W L Howell',
      'qat': 'Viktor Bologan',
      'farinata': 'Michele Godena',
      'horsethewhite': 'Frederick Neumann',
      'vaska': 'Larry M Christiansen',
      'mutalisk': 'Federico Perez Ponsa',
      'songlo209': 'Hoang Thai Tu',
      'depressnyak': 'Alexander Grischuk',
      'searchforbobby1': 'William T Marcelino',
      'nikipiki1': 'Nicola Timpani',
      's-hassan': 'Sayed Barakat Hassan',
      'smallville': 'Hikaru Nakamura',
      'karlnapf': 'Fabian Doettling',
      'impitoyable': 'Benoit Lepelletier',
      'walter': 'Walter Schulman',
      'cryptochess': 'Alexander R Katz',
      'vladimirovich': 'Dmitry Andreikin',
      'nichega': 'Dmitry Bocharov',
      'asidorov': 'Anatoly Sidorov'
    };

    return this.lookupPlayer(handle, suspected);
  }
};

module.exports = ICC;