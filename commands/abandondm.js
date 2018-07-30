var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function (args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }
        
        if (args.length > 1) {
            logger.log("Too many arguments for command '!abandondm'.");
            return;
        }

        for (i = 0; i < games.length; i++) {
            if (games[i].dm === message.author.id) {
                if (games[i].claimRequester) {
                    games[i].dm = games[i].claimRequester;
                    if (games[i].players.indexOf(games[i].claimRequester) !== -1) {
                        games[i].players.splice(games[i].players.indexOf(games[i].claimRequester), 1);
                    }
                    delete games[i].claimRequester;
                    message.reply("<@" + games[i].dm + "> is now the DM of game '" + games[i].session + "'!");
                    return;
                }
                message.reply("Game '" + games[i].session + "' has been abandoned.");
                games.splice(i, 1);
                return;
            }
        }

        message.author.send("Nice try, but you are no DM of a game right now.");
    },
    help: "Usage: `!abandondm`\n" +
        "If you are DM of a running game, this will make someone else the DM of it if someone applied, or delete the game session if not."
};