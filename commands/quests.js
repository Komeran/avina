/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Quests extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!quests <game>` where `<game>` is the name of the game of which you'd like to list the quests.\n" +
            "Lists all quests of the provided game if the game exists.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(args.length > 2) {
            logger.debug("Too many arguments for !quests command.");
            return;
        }

        if(!args[1]) {
            logger.debug("Not enough arguments for !quests command.");
            return;
        }

        let gid = message.guild.id;

        let gameId = Number(args[1]);

        if(isNaN(gameId)) {
            message.author.send("Sorry, but '" + args[1] + "' is not a valid Game ID!");
            return;
        }

        dbClient.getDnDGame(gid, gameId).then(function(game) {
            if(!game) {
                message.author.send("Sorry, but there is no game with the ID '" + args[1] + "'!");
                return;
            }

            dbClient.getDnDQuests(gid, gameId).then(function(quests) {
                if(!quests || quests.length === 0) {
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
            });
        });
    }
}

module.exports = Quests;