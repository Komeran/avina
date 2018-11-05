let logger = require('winston');
let fs = require('fs');
let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Draw extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!draw [<game>] [<count>]` where `<count>` is the number of cards you'd like to draw and `<game>` is the (optional) game name.\n" +
            "Draws a number of cards equal to the provided count or only one card if none was provided of the DnD " +
            "Deck of Many Things (22 Cards version) and sends a description of the drawn card(s) to your DM. If you joined " +
            "several games on this server, you have to provide the game parameter to let me know what DM gets the descriptions.";
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
            message.author.send("Too many arguments for the !draw command!");
            message.delete();
            return;
        }

        let gid = '' + message.guild.id;
        let gameName;
        let drawCount = 1;
        if(args.length === 2) {
            if(isNaN(Number(args[1]))) {
                gameName = args[1];
            }
            else {
                drawCount = Math.min(1, parseInt(args[1]));
            }
        }
        if(args.length === 3) {
            gameName = args[1];
            drawCount = Math.min(1, parseInt(args[2]));
        }

        // No game specified
        if(!gameName) {
            dbClient.getDnDGamesByPlayer(gid, message.author.id).then(function(games) {
                // User joined no games
                if(!games || (games.length && games.length === 0)) {
                    message.author.send("Sorry, but it looks like you haven't joined a game on this server yet!");
                    message.delete();
                    return;
                }

                // User joined exactly one game
                if(games.length === 1) {
                    let dm = message.guild.member(games[0].dungeonMasterSnowflake);

                    for(let i = 0; i < drawCount; i++) {
                        let result = Math.floor(Math.random() * 22) + 1;
                        message.author.send("", {file: './domt/' + result + '.png'});
                        let description = fs.readFileSync('./domt/descriptions/' + result + '.txt', "utf8");
                        dm.send(description);
                    }
                    message.delete();
                    return;
                }

                //User joined several games
                let embed = {
                    title: "List of games",
                    description: "Sorry, but you are playing in more than one game on this Discord server. You need to specify the game when using this command like this: `!draw <gameName> [<count>]`\nHere is a list of games you joined on that server:\n",
                    color: 3447003
                };
                for(let game of games) {
                    embed.description += "\n**" + game.name + "**";
                }
                message.author.send({embed: embed});
                message.delete();
            }).catch(errorFunc.bind(this, message));
            return;
        }
        // Game specified
        dbClient.getDnDGameByName(gid, gameName.toLowerCase()).then(function(game) {
            // Given game doesn't exist
            if(!game) {
                message.author.send("Sorry, but there is no game called '" + gameName + "' on that server.");
                message.delete();
                return;
            }

            dbClient.getDnDGamePlayers(gid, game.id).then(function(players) {
                if(!players || (players.length && players.length === 0)) {
                    message.author.send("Sorry, but that game has no players currently!");
                    message.delete();
                    return;
                }

                for(let player of players) {
                    // User joined the given game!
                    if(player.playerSnowflake === message.author.id) {
                        let dm = message.guild.member(game.dungeonMasterSnowflake);

                        for(let i = 0; i < drawCount; i++) {
                            let result = Math.floor(Math.random() * 22) + 1;
                            message.author.send("", {file: './domt/' + result + '.png'});
                            let description = fs.readFileSync('./domt/descriptions/' + result + '.txt', "utf8");
                            dm.send(description);
                        }
                        message.delete();
                        return;
                    }
                }

                // User didn't join the given game!
                message.author.send("Sorry, but you didn't join this game as a player!");
                message.delete();
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = Draw;

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