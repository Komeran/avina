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
        this.help = "Usage: `!removequest [<game>] <ID>` where `<ID>` is the ID number of the quest you'd like to remove " +
            "and `<game>` is the optional name of the game you want to remove the quest from.\n" +
            "Removes the quest with the provided ID number from the game you are currently DMing if you are DMing only " +
            "one and provided no game name or from the provided game name if you are DMing several games on this server. " +
            "Only DMs may use this command.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            message.delete();
            return;
        }

        if(args.length > 3) {
            message.author.send("Too many arguments for !removequest command.");
            message.delete();
            return;
        }

        if(!args[1]) {
            message.author.send("Not enough arguments for !removequest command.");
            message.delete();
            return;
        }

        let questId = Number(args[args.length-1]);
        let gameName;
        if(args.length === 3)
            gameName = args[1];

        if(isNaN(questId) || questId % 1 !== 0) {
            message.author.send(args[args.length-1] + " is not a valid Quest ID!");
            return;
        }

        let gid = message.guild.id;
        let dmId = message.author.id;

        dbClient.getDnDGamesByDM(gid, dmId).then(function(games) {
            // User is not DMing a game on that server.
            if(!games || (games.length && games.length === 0)) {
                message.author.send("Sorry, but you are currently not the DM of a game on this server. Quests can only be removed by DMs!");
                message.delete();
                return;
            }

            // User provided no game name
            if(!gameName) {
                // User is DMing exactly one game
                if(games.length === 1) {
                    dbClient.getDnDQuest(gid, games[0].id, questId).then(function(quest) {
                        if(!quest) {
                            message.author.send("There is no quest with ID " + questId + " in the game " + games[0].name);
                            message.delete();
                            return;
                        }

                        dbClient.deleteDnDQuests(quest).then(function() {
                            message.channel.send({
                                embed: {
                                    title: "Quest has been removed from game " + games[0].name,
                                    description: "[" + quest.id + "] " + quest.description,
                                    color: 3447003
                                }
                            });
                            message.delete();
                        }).catch(errorFunc.bind(this, message));
                    }).catch(errorFunc.bind(this, message));
                }
                // User is DMing more than one game
                else {
                    let embed = {
                        title: "List of games",
                        description: "Sorry, but you are DMing more than one game on this Discord server. You need to specify the game when using this command like this: `!removequest <gameName> <questID>`\nHere is a list of games you DM on that server:\n",
                        color: 3447003
                    };
                    for(let game of games) {
                        embed.description += "\n**" + game.name + "**";
                    }
                    message.author.send({embed: embed});
                    message.delete();
                }
                return;
            }

            // User specified game name
            let game;
            for(let g of games) {
                if(g.name.toLowerCase() === gameName.toLowerCase()) {
                    game = g;
                    break;
                }
            }

            if(!game) {
                message.author.send("Sorry, but it looks like you are not DMing a game called '" + gameName + "'. Please check for typos.");
                message.delete();
                return;
            }

            dbClient.getDnDQuest(gid, game.id, questId).then(function(quest) {
                if(!quest) {
                    message.author.send("Sorry, but there is no quest with the ID " + questId + " in the game " + gameName + "!");
                    message.delete();
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
                    message.delete();
                }).catch(errorFunc.bind(this, message));
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = RemoveQuest;

/**
 * Relays an error message to the default error output and tells the user to consult admins.
 * @param [message] {Message}
 * @param error {Error}
 */
function errorFunc(message, error) {
    logger.error(error);
    if(message) {
        message.author.send("Sorry, but something went wrong. If this keeps happening, please tell your admin!");
        message.delete();
    }
}