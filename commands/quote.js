/**
 * @author marc.schaefer
 * @date 07.11.2018
 */

let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;
const request = require("request");

class quote extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!quote`\n" +
            "Makes Avina respond with a random quote.";
    }

    /**
     *
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(args.length > 1) {
            message.author.send("Too many arguments for !quote command!");
            message.delete();
            return;
        }

        let wasCommand = args[0] !== null;

        request({
            method: 'GET',
            uri: "https://talaikis.com/api/quotes/random/"
        }, function (error, response, body) {
            let res = JSON.parse(body);

            if (!res) {
                message.author.send("Something went wrong. Please tell your admin if this keeps happening!");
                message.delete();
                return;
            }

            message.channel.send("*\"" + res.quote + "\"*\n-" + res.author);
            if (wasCommand)
                message.delete();
        });
    }
}

module.exports = quote;