var logger = require('winston');
var fs = require('fs');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function (args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(message.channel.name !== 'dnd-dice') {
            logger.info('Someone tried to draw a card of the Deck of Many Things in the wrong channel... This is a D&D only feature!');
        }

        let gid = message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        let game = null;
        let dm = null;

        games[gid].forEach(function(g) {
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
            if(!count){
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
    },
    help: "Usage: `!draw [<count>]` where `<count>` is the number of cards you'd like to draw.\n" +
        "Draws a number of cards equal to the provided count or only one card if none was provided of the DnD " +
        "Deck of Many Things (22 Cards version) and sends a description of the drawn card(s) to your DM."
};
