/**
 * @author marc.schaefer
 * @date 14.11.2018
 */

let logger = require('winston');
const MessageListener = require("../util/continuous/base_listeners/MessageListener.js");
const Message = require("discord.js").Message;
let dbClient = require('../databaseClient.js');
let commands = require('../util/commands.js');

class DispatchCommands extends MessageListener {

    /**
     * @override
     * @param message {Message}
     */
    execute(message) {
        dbClient.getTextChannel(message.channel.id).then(function(textChannel) {
            let isIgnored = !!textChannel && !!textChannel.ignoreCommands;

            if (message.content.substring(0,1) === '!') {
                let args = message.content.substring(1).split(' ');
                let cmd = args[0].toLowerCase();
                if(commands.cmds[cmd] && (cmd === "ignore" || !isIgnored)) {
                    try {
                        commands.callCommand(cmd, message, args);
                    }
                    catch(e) {
                        logger.error(e);
                    }
                }
            }
        }).catch(logger.error);
    }
}

module.exports = DispatchCommands;