const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;
const path = require("path");

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
class ParentCommand extends BaseCommand {

    constructor() {
        super();
        this.fs = require('fs');

        /**
         * @abstract
         * @type {string}
         */
        this.subCommandDirectory="";
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
        /**
         * @override
         * @type {string}
         */
        this.help =this._generateHelpString();
    }


    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(args[1]) {
            let subcmd = args[1];
            if(this.subCommands[subcmd]) {
                this.subCommands[subcmd].execute();
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