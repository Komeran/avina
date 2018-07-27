/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = function(args, message) {
    if(args.length > 2) {
        logger.log("Too many arguments for !removequest command.");
        return;
    }

    if(!args[1]) {
        logger.log("Not enough arguments for !removequest command.");
        return;
    }

    let id = Number(args[1]);

    if(isNaN(id) || id % 1 !== 0) {
        message.author.send(args[1] + " is not a valid Quest ID!");
    }

    for(let g in games) {
        if(games[g].dm === message.author.id) {
            if(!games[g].quests || games[g].quests.length < id) {
                message.author.send("There is no quest with ID " + id + " in the game " + games[g].session);
                return;
            }
            message.channel.send({
                embed: {
                    title: "Quest has been removed from game " + games[g].session,
                    description: "[" + id + "] " + games[g].quests[id-1].description,
                    color: 3447003
                }
            });
            games[g].quests.splice(id-1, 1);
            return;
        }
    }
    message.author.send("Sorry, but you are currently not the DM of a game. Quests can only be removed by DMs!");
};