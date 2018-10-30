let dbClient = require('../databaseClient.js');
let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Games extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!games`\n" +
            "Lists the current running games including their DMs and Player Numbers";
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

        let gid = message.guild.id;

        dbClient.getDnDGames(gid).then(function(games) {
            if(!games || games.length === 0) {
                message.author.send("There are no games currently! Be the first to start one using `!claimdm <Game>` , or have your DM do it!");
                return;
            }

            let embed = {
                color: 3447003,
                title: "List of running Games",
                description: "",
                fields: []
            };

            games.forEach(function(game) {
                let players = dbClient.getDnDGamePlayers(gid, game.id);
                let playerCount = players? players.length : 0;
                embed.fields.push({
                    name: game.name,
                    value: "DM: <@" + game.dungeonMasterSnowflake + ">\nPlayers: " + playerCount + "/" + game.playerMax
                });
            }, this);

            message.channel.send({'embed': embed});
        }).catch(logger.error);
    }
}

module.exports = Games;
