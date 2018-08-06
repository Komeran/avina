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

        if(!args[1]) {
            logger.log("Not enough arguments for !newquest command.");
            return;
        }

        let gid = '' + message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        let questDescription = "";
        for(let i = 1; i < args.length; i++) {
            questDescription += args[i] + " ";
        }
        questDescription = questDescription.substring(0, questDescription.length-1);

        for(let g in games[gid]) {
            if(games[gid][g].dm === message.author.id) {
                if(!games[gid][g].quests)
                    games[gid][g].quests = [];
                games[gid][g].quests.push({
                    description: questDescription,
                    completed: false
                });
                message.channel.send({
                    embed: {
                        title: "Added Quest to game " + games[gid][g].session,
                        description: "[" + games[gid][g].quests.length + "] " + questDescription,
                        color: 3447003
                    }
                });
                return;
            }
        }
        message.author.send("Sorry, but you are currently not the DM of a game. New quests can only be added by DMs!");
    },
    help: "Usage: `!newquest <quest>` where `<quest>` is the name (including spaces) of the quest you'd like to create.\n" +
        "Creates a new quest with the given name for the game you are currently DMing. Only DMs may use this command."
};