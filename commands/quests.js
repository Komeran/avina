/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');

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

        let gameId = Number(args[1]);

        if(isNaN(gameId)) {
            message.author.send("Sorry, but '" + args[1] + "' is not a valid Game ID!");
            return;
        }

        let game = dbClient.getDnDGame(gid, gameId);

        if(!game) {
            message.author.send("Sorry, but there is no game with the ID '" + args[1] + "'!");
            return;
        }

        let quests = dbClient.getDnDQuests(gid, gameId);

        if(!quests) {
            message.channel.send({
                embed: {
                    title: "Quest List of game " + game.name,
                    description: "There are no Quests!",
                    color: 3447003
                }
            });
            return;
        }
        for(let q in quests) {
            fields.push({
                name: "[" + (quests[q].id) + "] " + quests[q].description,
                value: "Status: " + (quests[q].completed ? "Completed" : "Open")
            });
        }
        message.channel.send({
            embed: {
                title: "Quest List of game " + game.name,
                color: 3447003,
                fields: fields
            }
        });
    },
    help: "Usage: `!quests <game>` where `<game>` is the name of the game of which you'd like to list the quests.\n" +
        "Lists all quests of the provided game if the game exists."
};