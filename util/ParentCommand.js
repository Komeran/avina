const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
class ParentCommand extends BaseCommand {
    fs = require('fs');
    /**
     * @abstract
     * @type {string}
     */
    subCommandDirectory="";
    normalizedPath = path.join(__dirname, "..", this.subCommandDirectory);
    subCommands={};

    constructor() {
        super();
        this.fs.watch(this.normalizedPath, { recursive:true }, function(eventType,fileName) {
            if(!fileName) {
                return;
            }
            let commandString = fileName.substring(0, fileName.length-3);
            if(eventType === 'change' || this.fs.existsSync(path.join(this.normalizedPath, fileName))) {
                let commandClass = import(path.join(this.normalizedPath, fileName));
                if(commandClass && commandClass.prototype && commandClass.prototype instanceof BaseCommand) {
                    this.subCommands[commandString] = new commandClass();
                    return;
                }
            } else {
                delete this.subCommands[commandString];
            }
        }.bind(this));
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

    /**
     * @override
     * @type {string}
     */
    help =this._generateHelpString();


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
