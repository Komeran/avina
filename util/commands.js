import {Message} from "discord.js";

// noinspection JSUnresolvedFunction
let fs = require('fs');
let path = require('path');
let logger = require('winston');

let normalizedPath = path.join(__dirname, "../commands");
logger.info("Loading commands...");
let commands = {};
let cmdCount = 0;

/**
 *
 * @param cmd {string} The Command
 * @param message {Message} The message object from the Discord API
 * @param args {string[]} Array of all arguments including the command itself at index 0
 * @static
 */
const callCommand = function(cmd, message, args) {
    commands[cmd].execute(args, message);
};

/**
 *
 * @param cmdString {string}
 * @static
 */
function deleteCommand(cmdString) {
    delete commands[cmdString];
}

initDirectory();

/**
 * @static
 */
function initDirectory() {
    fs.readdirSync(normalizedPath).forEach(function(file) {
        let commandString = file.substring(0, file.length-3);
        commands[commandString] = require(path.join(normalizedPath, file));
        logger.debug("Loaded command [!" + commandString + "]");
        cmdCount++;
    });
    logger.info("Loaded " + cmdCount + " commands.");
}

fs.watch(normalizedPath, { recursive:true }, function(eventType,fileName) {
    if(!fileName) {
        deleteCommand(fileName);
        return;
    }
    if(eventType === 'change' || fs.existsSync(path.join(normalizedPath, fileName))) {
        commands[fileName] = require(path.join(normalizedPath, fileName));
    } else {
        deleteCommand(fileName);
    }
}.bind(this));

module.exports = {
    cmds: commands,
    callCommand: function(cmd, message, args) {
        return callCommand(cmd, message, args);
    }
};