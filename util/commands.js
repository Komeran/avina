import {Message} from "discord.js";
import {BaseCommand} from "./BaseCommand";

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
        let commandClass = import(path.join(normalizedPath, file));
        if(commandClass && commandClass.prototype && commandClass.prototype instanceof BaseCommand) {
            commands[commandString] = new commandClass();
            logger.debug("Loaded command [!" + commandString + "]");
            cmdCount++;
            return;
        }
        logger.warn(file + " is not a valid command file!");
    });
    logger.info("Loaded " + cmdCount + " commands.");
}

fs.watch(normalizedPath, { recursive:true }, function(eventType,fileName) {
    if(!fileName) {
        return;
    }
    let commandString = file.substring(0, file.length-3);
    if(eventType === 'change' || fs.existsSync(path.join(normalizedPath, fileName))) {
        let commandClass = import(path.join(normalizedPath, fileName));
        if(commandClass && commandClass.prototype && commandClass.prototype instanceof BaseCommand) {
            commands[commandString] = new commandClass();
            logger.debug("Loaded command [!" + commandString + "]");
            cmdCount++;
            return;
        }
        logger.warn(file + " is not a valid command file!");
    } else {
        deleteCommand(commandString);
    }
}.bind(this));

module.exports = {
    cmds: commands,
    callCommand: function(cmd, message, args) {
        return callCommand(cmd, message, args);
    }
};