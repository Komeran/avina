/**
 * @author marc.schaefer
 * @date 14.11.2018
 */

let logger = require('winston');
const MessageListener = require("../util/continuous/base_listeners/MessageListener.js");
const Message = require("discord.js").Message;
let reactTo = require('../util/reactTo.js');

class ReactToSmalltalk extends MessageListener {
    /**
     * @override
     * @param message {Message}
     */
    execute(message) {
        if(!message.guild && message.author.id !== message.client.user.id) {
            reactTo(message, message.client.user.id);
            return;
        }
        if(message.author.id === message.client.user.id || isIgnored)
            return;
        for(let user of message.mentions.users) {
            if(user[0] === message.client.user.id) {
                reactTo(message, message.client.user.id);
                return;
            }
        }
    }
}

module.exports = ReactToSmalltalk;