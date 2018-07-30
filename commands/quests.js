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
            logger.log("Too many arguments for !quests command.");
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !quests command.");
            return;
        }

        let gid = message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        for(let g in games[gid]) {
            if(games[gid][g].session === args[1].toLowerCase()) {
                let fields = [];
                if(!games[gid][g].quests || games[gid][g].quests.length === 0) {
                    message.channel.send({
                        embed: {
                            title: "Quest List of game " + games[gid][g].session,
                            description: "There are no Quests!",
                            color: 3447003
                        }
                    });
                    return;
                }
                for(let q in games[gid][g].quests) {
                    fields.push({
                        name: "[" + (Number(q)+1) + "] " + games[gid][g].quests[q].description,
                        value: "Status: " + (games[gid][g].quests[q].completed ? "Completed" : "Open")
                    });
                }
                message.channel.send({
                    embed: {
                        title: "Quest List of game " + games[gid][g].session,
                        color: 3447003,
                        fields: fields
                    }
                });
                return;
            }
        }
        message.author.send("Sorry, but the game '" + args[1].toLowerCase() + "' doesn't exist yet.");
    },
    help: "Usage: `!quests <game>` where `<game>` is the name of the game of which you'd like to list the quests.\n" +
        "Lists all quests of the provided game if the game exists."
};