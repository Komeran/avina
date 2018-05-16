var logger = require('winston');
var fs = require('fs');

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
      logger.info('Someone drew '+count+(count==1?' card!':' cards!'));

      var result = Math.floor(Math.random() * 22) + 1;
      message.author.send("", { file:'./domt/'+result+'.png' });
      var description = fs.readFileSync('./domt/descriptions/'+result+'.txt', "utf8");
      message.guild.members.get("246338949465767937").send(description);
      /*
      var drawn = [0];
      for (var i = 0; i < count; i++) {
        var result = Math.floor(Math.random() * 22) + 1;
        if(drawn.indexOf(result) > -1){
          i--;
          continue;
        }
        drawn.push(result);
        message.author.send("Card number "+(i+1), { file:'./domt/'+result+'.png' });
        var description = fs.readFileSync('./domt/descriptions/'+result+'.txt', "utf8");
        message.guild.members.get("246338949465767937").send("#"+(i+1)+" - "+description);
        if(result == 3 || result == 22) {
          break;
        }
        if(result == 7) {
          i--;
        }
      }
      */
  }
}
