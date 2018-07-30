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

        let gid = '' + message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        for (i = 0; i < games.length; i++) {
            if (games[gid][i].dm === message.author.id) {
                if (games[gid][i].claimRequester) {
                    games[gid][i].dm = games[gid][i].claimRequester;
                    if (games[gid][i].players.indexOf(games[gid][i].claimRequester) !== -1) {
                        games[gid][i].players.splice(games[gid][i].players.indexOf(games[gid][i].claimRequester), 1);
                    }
                    delete games[gid][i].claimRequester;
                    message.reply("<@" + games[gid][i].dm + "> is now the DM of game '" + games[gid][i].session + "'!");
                    return;
                }
                message.reply("Game '" + games[gid][i].session + "' has been abandoned.");
                games[gid].splice(i, 1);
                return;
            }
        }

        message.author.send("Nice try, but you are no DM of a game right now.");
    },
    help: "Usage: `!abandondm`\n" +
        "If you are DM of a running game, this will make someone else the DM of it if someone applied, or delete the game session if not."
};