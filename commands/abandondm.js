let logger = require('winston');
let dbClient = require("../databaseClient.js");
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class AbandonDM extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!abandondm`\n" +
        "If you are DM of a running game, this will make someone else the DM of it if someone applied, or delete the game session if not."
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

        if (args.length > 3) {
            message.author.send("Too many arguments for command '!abandondm'.");
            message.delete();
            return;
        }

        let gid = '' + message.guild.id;

        let func = args.length > 2 ? getGame.bind(this, args[2].toLowerCase(), gid) : getGamesOfPlayer.bind(this, message.author.id, gid);

        func().then(function(games) {
            if(!games) {
                if(args[2]) {
                    message.author.send("Sorry, but the game '" + args[2] + "' does not exist, or you are not the DM of it!");
                    message.delete();
                    return;
                }
                message.author.send("Sorry, but you are not the DM of any games!");
                message.delete();
                return;
            }
            if(games.length && games.length === 0) {
                message.author.send("Sorry, but you are not the DM of any games!");
                message.delete();
                return;
            }

            if(games.length && games.length > 1) {
                let embed = {
                    color: 3447003,
                    title: "List of Games you're DMing right now:",
                    description: "Looks like you are DMing more than just one game! Please use `!abandondm <game>` to specify which game you want to abandon.\n"
                };

                for(let i = 0; i < games.length; i++) {
                    embed.description += "\n**> " + games[i].name + "**";
                }

                message.author.send({embed: embed});
                message.delete();
                return;
            }

            let game = games;
            if(game.length)
                game = game[0];

            dbClient.getDnDDmRequestsByGame(game.name, game.guildSnowflake).then(function(requests) {
                if(!requests) {
                    requests = [];
                }
                if(requests.length > 1) {
                    // Several requesters. We need the DM to pick one.
                    let embed = {
                        color: 3447003,
                        title: "List of DM Requests:",
                        description: "Looks like the game '" + game.name + "' has more than 1 player requesting DM status! Please use `!abandondm " + game.name + " <@mention>` to specify who you want to be the new DM!\n"
                    };

                    for(let i = 0; i < requests.length; i++) {
                        embed.description += "\n**> " + message.guild.member(requests[i].userSnowflake).nickname + "**";
                    }

                    message.author.send({embed: embed});
                    message.delete();
                    return;
                }
                if(requests.length === 1) {
                    // Exactly one requester. Make him the new DM.
                    dbClient.deleteDnDDmRequests(requests[0]).then(function() {
                        game.dungeonMasterSnowflake = requests[0].userSnowflake;
                        dbClient.addDnDGames(false, game).then(function() {
                            message.author.send("You are no longer the DM of the game '" + game.name + "'! You handed it over to " + message.guild.member(requests[0].userSnowflake).nickname + "!");
                            message.delete();
                        }).catch(errorFunc.bind(this, message));
                    }).catch(errorFunc.bind(this, message));
                }
                else {
                    // No DM request. Delete the game.
                    dbClient.deleteDnDGames(game).then(function() {
                        message.author.send("Nobody requested to be the new DM for the game, so it was deleted!");
                        message.delete();
                    }).catch(errorFunc.bind(this, message));
                }
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = AbandonDM;

async function getGame(gameId, guildSnowflake) {
    return await dbClient.getDnDGame(gameId, guildSnowflake);
}

async function getGamesOfPlayer(userSnowflake, guildSnowflake) {
    return await dbClient.getDnDGamesByDM(guildSnowflake, userSnowflake);
}

/**
 * Relays an error message to the default error output and tells the user to consult admins.
 * @param [message] {Message}
 * @param error {Error}
 */
function errorFunc(message, error) {
    logger.error(error);
    if(message)
        message.author.send("Sorry, but something went wrong. If this keeps happening, please tell your admin!");
}