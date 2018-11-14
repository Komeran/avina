const BaseContinuous = require("../BaseContinuous");
const Message = require("discord.js").Message;

/**
 * Executes when a discord user sends a message
 * @author marc.schaefer
 * @date 14.11.2018
 */
class MessageListener extends BaseContinuous {
    /**
     * Constructor
     */
    constructor() {
        super("message");
    }

    /**
     * This is called whenever a user sends a message and Avina can read it
     * @param message {Message}
     * @abstract
     */
    execute(message) {
        throw new Error("abstract function yo");
    }
}

module.exports = MessageListener;