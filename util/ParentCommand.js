const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;
const path = require("path");

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
class ParentCommand extends BaseCommand {

    constructor(subCommandDirectory) {
        super();
        this.subCommandDirectory = subCommandDirectory;
        this.fs = require('fs');
        this.normalizedPath = path.join(__dirname, "..", this.subCommandDirectory);
        this.subCommands={};
        this.fs.watch(this.normalizedPath, { recursive:true }, function(eventType,fileName) {
            if(!fileName) {
                return;
            }
            let commandString = fileName.substring(0, fileName.length-3);
            if(eventType === 'change' || this.fs.existsSync(path.join(this.normalizedPath, fileName))) {
                let commandClass = require(path.join(this.normalizedPath, fileName));
                if(commandClass && commandClass.prototype && commandClass.prototype instanceof BaseCommand) {
                    this.subCommands[commandString] = new commandClass();
                }
            } else {
                delete this.subCommands[commandString];
            }
        }.bind(this));
        this.updateSubcommands();
        /**
         * @override
         * @type {string}
         */
        this.help =this._generateHelpString();
    }

    /**
     *
     * @param [directory] {String}
     */
    updateSubcommands(directory) {
        directory = directory || this.subCommandDirectory;
        let normalizedPath = path.join(__dirname, "..", directory);
        let cmdCount = 0;
        this.fs.readdirSync(normalizedPath).forEach(function(file) {
            let commandString = file.substring(0, file.length-3);
            let commandClass = require(path.join(normalizedPath, file));
            if(commandClass && commandClass.prototype && commandClass.prototype instanceof BaseCommand) {
                this.subCommands[commandString] = new commandClass();
                logger.debug("Loaded subcommand [!" + commandString + "]");
                cmdCount++;
                return;
            }
            logger.warn(file + " is not a valid command file!");
        });
        logger.info("Loaded " + cmdCount + " subcommands.");
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(args[1]) {
            if(this.subCommands[args[1]]) {
                this.subCommands[args[1]].execute(args, message);
            }
        }
    }

    _generateHelpString() {
        let helpStr=this.name + " help:";
        for(let prop in this.subCommands) {
            if(this.subCommands[prop].help) {
                helpStr+="\n"+this.subCommands[prop].help;
            }
        }
        return helpStr;
    }
}

module.exports = ParentCommand;