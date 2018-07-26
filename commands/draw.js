var logger = require('winston');
var fs = require('fs');
var games = require('../dnd_util/games.js');

module.exports = function (args, message) {
  if(message.channel.name != 'dnd-dice') {
    logger.info('Someone tried to draw a card of the Deck of Many Things in the wrong channel... This is a D&D only feature!');
  }

  let game = null;
  let dm = null;

  games.forEach(function(g) {
    if(g.players.indexOf(message.author.id) !== -1) {
      game = g;
      dm = message.guild.member(''+g.dm);
    }
  });

  if(!game) {
    message.author.send("Sorry, but you have to be in a game before using the !draw command. Just use !joingame <game> to join a game!");
    return;
  }

  if(args.length <= 2) {
      var count = args[1];
      if(!args[1]){
        count = 1;
      }
      if(count < 1 || count > 10) {
          logger.info('Someone tried to draw '+diceSides+' cards from the Deck of Many Things.');
          logger.info('How funny...');
          return;
      }
      if(isNaN(count)) {
          logger.info('Someone tried to draw a number of cards from the Deck of Many Things that is NaN!');
          return;
      }
      logger.info('Someone drew '+count+(count==1?' card!':' cards!'));

      var result = Math.floor(Math.random() * 22) + 1;
      message.author.send("", { file:'./domt/'+result+'.png' });
      var description = fs.readFileSync('./domt/descriptions/'+result+'.txt', "utf8");
      dm.send(description);
  }
}
