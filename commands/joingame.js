let logger = require('winston');
let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class JoinGame extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!joingame <game>` where `<game>` is the name of the game you'd like to join.\n" +
            "Joins the game with the provided name if it isn't already full and you are not the DM of this game.";
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

        if(args.length > 2) {
            message.author.send("Too many Arguments provided for command '!joingame'!");
            message.delete();
            return;
        }

        if(!args[1]) {
            message.author.send("Not enough arguments for !joingame command.");
            message.delete();
            return;
        }

        let gid = '' + message.guild.id;

        dbClient.getDnDGameByName(gid, args[1].toLowerCase()).then(function(game) {
            // Game doesn't exist
            if(!game) {
                message.author.send("Sorry, but that game doesn't exist on this server! Check for typos.");
                message.delete();
                return;
            }

            // User is DM of the game!
            if(game.dungeonMasterSnowflake === message.author.id) {
                message.author.send("Sorry, but you are the current DM of the game and can't join it as a player!");
                message.delete();
                return;
            }

            dbClient.getDnDGamePlayers(gid, game.id).then(function(players) {
                players = players || [];

                for(let player of players) {
                    // User already joined the game
                    if(player.playerSnowflake === message.author.id) {
                        message.author.send("Sorry, but you already joined that game! You can't join it twice.");
                        message.delete();
                        return;
                    }
                }

                // User can join the game
                dbClient.addDnDGamePlayers(true, message.author.id).then(function() {
                    message.author.send("You successfully joined the game " + game.name + "!");
                    message.delete();
                }).catch(errorFunc.bind(this, message));
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = JoinGame;

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