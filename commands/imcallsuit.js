/**
 * @author marc.schaefer
 * @date 01.08.2018
 */

let logger = require('winston');
let games = require('../dnd_util/games.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class IMCallsuit extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!imcallsuit`\n" +
            "Calls an iron man suit and sends both you and your current dm the stats of said suit. If you are the dm of the game, only you will receive the stats.";
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

        let embed = {
            color: 3447003,
            title: "List of running Games",
            description: "",
            fields: []
        };

        games.forEach(function(game) {
            embed.fields.push({
                name: game.session,
                value: "DM: <@" + game.dm + ">\nPlayers: " + game.players.length + "/" + game.maxPlayers
            });
        }, this);

        if(games.length === 0) {
            embed.description = "There are no games currently! Be the first to start one using !claimdm <Game> , or have your DM do it!";
        }

        if(args.length <= 2) {
            var suitNumber = Number(args[1]);


            message.author.send("", { file:'./ironman/suits/'+result+'.png' });
            dm.send("", { file:'./ironman/suits/'+result+'.png' });
        }
    }
}

module.exports = null; // TODO: export IMCallsuit class once implemented