/**
 * @author marc.schaefer
 * @date 01.08.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
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

        // TODO: Add functionality
    }
}

module.exports = null; // TODO: export IMCallsuit class once implemented