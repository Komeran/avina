/**
 * @author marc.schaefer
 * @date 26.07.2018
 */

let logger = require('winston');
let dbClient = require("../databaseClient.js");
let DnDDmRequest = require("../databaseClient.js").DnDDmRequest;
let DnDGame = require("../databaseClient.js").DnDGame;
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class ClaimDM extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!claimdm <game>` where `<game>` can be any text without spaces.\n" +
            "Creates a new game with the provided name if it doesn't exist already. If it does, a claim request will be noted. " +
            "Once the current DM of the game abandons it, you will be the new DM.";
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

        if(args.length > 3) {
            message.author.send("Sorry, but this command needs only 1 argument!");
            return;
        }

        if(!args[1]) {
            message.author.send("Sorry, but this command needs at least 1 argument!");
            return;
        }

        let gid = '' + message.guild.id;

        dbClient.getDnDGames(gid).then(function(cg) {
            if(!cg) {
                cg = [];
            }

            for(let g in cg) {
                if(cg[g].dungeonMasterSnowflake === message.author.id) {
                    message.reply("You are already DM of game '" + cg[g].name + "'. Please use !abandondm first before" +
                        " claiming DM status of a new game.");
                    break;
                }
            }

            for(let g in cg) {
                if(cg[g].name === args[1].toLowerCase()) {
                    if(cg[g].dungeonMasterSnowflake === message.author.id) {
                        message.author.send("You are already the DM of game '" + cg[g].name + "'.");
                        message.delete();
                        return;
                    }
                    // Add a DM request if there isn't one already
                    dbClient.addDnDDmRequests(new DnDDmRequest(message.author.id, cg[g].id, message.guild.id)).then(function() {
                        message.reply("<@" + cg[g].dungeonMasterSnowflake + "> is the current DM of game '" + cg[g].name + "'. Your request for" +
                            " a claim has been noted.");
                    }).catch(logger.error);
                    break;
                }
            }

            let playerMax = isNaN(Number(args[2])) ? 6 : parseInt(args[2]);

            let newGame = new DnDGame(null, gid, args[1].toLowerCase(), playerMax, message.author.id);

            dbClient.addDnDGames(false, newGame).then(function() {
                message.reply("You successfully created the game '" + args[1].toLowerCase() + "'! Players can now use !joingame " + args[1].toLowerCase()
                    + " to join the game!");
            }).catch(logger.error);
        });
    }
}

module.exports = ClaimDM;