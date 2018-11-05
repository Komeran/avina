/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class CompleteQuest extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!completequest [<game>] <ID>` where `<ID>` is the ID number of a quest and `<game>` is the (optional) name of the game the quest is in.\n" +
            "Marks the quest with the provided ID number as completed if it was open, or as open if it was completed. Only DMs may use this command. " +
            "If you DM more than one game, you have to provide the game parameter to specify the game, where the quest is in.";
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
            message.author.send("Too many arguments for !completequest command.");
            message.delete();
            return;
        }

        if(!args[1]) {
            message.author.send("Not enough arguments for !completequest command.");
            message.delete();
            return;
        }

        let id = Number(args[args.length-1]);

        if(isNaN(id) || id % 1 !== 0) {
            message.author.send(args[args.length-1] + " is not a valid Quest ID!");
            message.delete();
            return;
        }

        let gid = message.guild.id;
        let dmId = message.author.id;
        let gameName = args.length === 3 ? args[1] : null;

        dbClient.getDnDGamesByDM(gid, dmId).then(function(games) {
            // No DMed games
            if(!games || (games.length && games.length === 0)) {
                message.author.send("Sorry, but you are currently not the DM of a game. Quests can only be (un-)completed by DMs!");
                message.delete();
                return;
            }
            // No game specified
            if(!gameName) {
                // Exactly one DMed game
                if(games.length === 1) {
                    dbClient.getDnDQuest(gid, games[0].id, id).then(function(quest) {
                        if(!quest) {
                            message.author.send("Sorry, but there is no quest with ID " + id + " in the game '" + games[0].name + "!");
                            message.delete();
                            return;
                        }

                        quest.completed = !quest.completed;

                        dbClient.addDnDQuests(quest).then(function() {
                            message.channel.send({
                                embed: {
                                    title: "Quest of game " + game[0].name + " has been " + (quest.completed ? "" : "un") + "completed!",
                                    description: "[" + quest.id + "] " + quest.description,
                                    color: 3447003
                                }
                            });
                            message.delete();
                        }).catch(errorFunc.bind(this, message));
                    }).catch(errorFunc.bind(this, message));
                }
                // More than one DMed game
                else {
                    let embed = {
                        title: "List of games",
                        description: "Sorry, but you are DMing more than one game on this Discord server. You need to specify the game when using this command like this: `!completequest <gameName> <questID>`\nHere is a list of games you DM on that server:\n",
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

            // Game specified

            let gameId = null;
            for(let game of games) {
                if(game.name.toLowerCase() === gameName.toLowerCase()) {
                    gameId = game.id;
                    break;
                }
            }

            // That game is not DMed by the user or doesn't exist at all
            if(!gameId) {
                message.author.send("Sorry, but you don't DM a game called '" + gameName + "' on that server. Check for typos.");
                message.delete();
                return;
            }

            dbClient.getDnDQuest(gid, gameId, id).then(function(quest) {
                if(!quest) {
                    message.author.send("Sorry, but there is no quest with ID " + id + " in the game '" + gameName + "!");
                    message.delete();
                    return;
                }

                quest.completed = !quest.completed;

                dbClient.addDnDQuests(quest).then(function() {
                    message.channel.send({
                        embed: {
                            title: "Quest of game " + gameName + " has been " + (quest.completed ? "" : "un") + "completed!",
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

module.exports = CompleteQuest;

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