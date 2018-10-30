/**
 * @author marc.schaefer
 * @date 24.08.2018
 */

let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Clear extends BaseCommand {
    constructor() {
        super();
        this.help = "";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
                .then(function(list){
                    message.channel.bulkDelete(list);
                }, function(err){
                    message.channel.send("ERROR: ERROR CLEARING CHANNEL.");
                    logger.error(err);
                })
        }
    }
}

module.exports = Clear;