/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

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
            return;
        }

        let gid = '' + message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        for(let g in games[gid]) {
            if(games[gid][g].dm === message.author.id) {
                if(!games[gid][g].quests || games[gid][g].quests.length < id) {
                    message.author.send("There is no quest with ID " + id + " in the game " + games[gid][g].session);
                    return;
                }
                message.channel.send({
                    embed: {
                        title: "Quest has been removed from game " + games[gid][g].session,
                        description: "[" + id + "] " + games[gid][g].quests[id-1].description,
                        color: 3447003
                    }
                });
                games[gid][g].quests.splice(id-1, 1);
                return;
            }
        }
        message.author.send("Sorry, but you are currently not the DM of a game. Quests can only be removed by DMs!");
    },
    help: "Usage: `!removequest <ID>` where `<ID>` is the ID number of the quest you'd like to remove.\n" +
        "Removes the quest with the provided ID number from the game you are currently DMing. Only DMs may use this command."
};