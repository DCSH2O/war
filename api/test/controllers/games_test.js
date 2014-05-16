'use strict';

var GamesController = require('../../app/controllers/games');

describe('GamesController', function () {
  context('#index', function () {
    it('should list all games', function (done) {
      GameController.index(null, { json: function () {
        catching(done, function () {
        });
      }});
    });
  });

  context('#create', function () {
    it('should create a new game', function (done) {
      GameController.create({ body: { players: [] }}, {
        json: function () {
          catching(done, function () {
            expect(Game.prototype.save.calledOnce).to.be.true;
          });
        }
      });
    });
  });
  
  context.only('#waiting', function () {
    it('should add player to the waiting list', function () {
      var player = 'player' + Math.random();
      GamesController.waiting({
        body: {
          player: player
        }
      }, {
        json: function () {
          GamesController._waiting.should.contain(player);
        }
      })
    });

    it('should validate presence of player', function () {
      GamesController.waiting({
        body: {
          player: ''
        }
      }, {
        json: function (status, res) {
          status.should.equal(422);
        }
      })
    });
  });
});
