/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class RemoveQuest extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!removequest <ID>` where `<ID>` is the ID number of the quest you'd like to remove.\n" +
            "Removes the quest with the provided ID number from the game you are currently DMing. Only DMs may use this command.";
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
            logger.debug("Too many arguments for !removequest command.");
            return;
        }

        if(!args[1]) {
            logger.debug("Not enough arguments for !removequest command.");
            return;
        }

        let id = Number(args[1]);

        if(isNaN(id) || id % 1 !== 0) {
            message.author.send(args[1] + " is not a valid Quest ID!");
            return;
        }

        let gid = message.guild.id;
        let dmId = message.author.id;

        dbClient.getDnDGameByDM(gid, dmId).then(function(game) {
            if(!game) {
                message.author.send("Sorry, but you are currently not the DM of a game. Quests can only be removed by DMs!");
                return;
            }

            dbClient.getDnDQuest(gid, game.id, id).then(function(quest) {
                if(!quest) {
                    message.author.send("There is no quest with ID " + id + " in the game " + game.name);
                    return;
                }

                dbClient.deleteDnDQuests(quest).then(function() {
                    message.channel.send({
                        embed: {
                            title: "Quest has been removed from game " + game.name,
                            description: "[" + quest.id + "] " + quest.description,
                            color: 3447003
                        }
                    });
                }).catch(function(error) {
                    logger.error(error);
                    message.author.send("Sorry, but something went wrong. The Quest was not deleted. If this keeps happening, please tell your admin!");
                });
            });
        });
    }
}

module.exports = RemoveQuest;