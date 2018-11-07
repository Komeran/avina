/**
 * @author marc.schaefer
 * @date 07.11.2018
 */

let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

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
            uri: "http://quotesondesign.com/wp-json/posts"
        }, function(error, response, body) {
            let res = JSON.parse(body);

            if(!res || res.length === 0) {
                message.author.send("Something went wrong. Please tell your admin if this keeps happening!");
                message.delete();
                return;
            }

            let regex_num_set = /&#(\d+);/g;
            res[0].content = res[0].content.replace(regex_num_set, function(_, $1) {
                return String.fromCharCode($1);
            });
            res[0].title = res[0].title.replace(regex_num_set, function(_, $1) {
                return String.fromCharCode($1);
            });

            console.log("*\"" + res[0].content.replace("<p>", "").replace("<\\/p>\\n", "") + "\"*\n-" + res[0].title);

            message.channel.send("*\"" + res[0].content.replace("<p>", "").replace("<\\/p>\\n", "") + "\"*\n-" + res[0].title);
            if(wasCommand)
                message.delete();
        });
    }
}

module.exports = quote;