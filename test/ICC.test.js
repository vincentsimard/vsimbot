(function() {
  'use strict';

  var sinon = require('sinon');
  var chai = require('chai');
  var should = chai.should();

  var request = require('request');

  var ICC = require('./../src/ICC.js');



  describe('ICC', function() {
    it('should be defined', function() {
      ICC.should.not.be.undefined;
    });

    describe('finger', function() {
      before(function(done){
        sinon
          .stub(request, 'get')
          .yields(null, null, '');
        done();
      });

      after(function(done){
        request.get.restore();
        done();
      });

      it('should make a request to chessclub.com', function(done){
        ICC.finger('handle', function(){
          request.get.called.should.be.true;

          done();
        });
      });
    });
  });
})();