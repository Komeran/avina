var logger = require('winston');

module.exports = function (args, message) {
  if(message.channel.name != 'dnd-dice') {
    logger.info('Someone tried to draw a card of the Deck of Many Things in the wrong channel... This is a D&D only feature!');
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
      for (var i = 0; i < count; i++) {
        var result = Math.floor(Math.random() * 22) + 1;
        message.author.send("", { file:'./domt/'+result+'.png' });
      }
  }
}
