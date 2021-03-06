const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

let logger = require('winston');

class Help extends BaseCommand {

    constructor() {
        super();
        this.help = "Usage: `!help [<command>]` where `<command>` is one of my commands.\nLists all of my commands just like this if no command parameter was provided, or the usage description of the command if a valid one was provided.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(args.length > 2) {
            logger.debug("Too many arguments for !help command.");
            //return;
        }

        let commands = require('../util/commands.js');

        if(args[1]) {
            let command = args[1].replace('!', '');

            if(!commands.cmds[command.toLowerCase()]) {
                message.author.send("Sorry, but `" + command + "` is not one of my commands!\nMaybe you misspelled it?\nUse `!help` to list all my commands!");
                message.delete();
                return;
            }
            let msg;
            if(commands.cmds[command].help)
                msg = typeof commands.cmds[command].help === "string"? commands.cmds[command].help : commands.cmds[command].help(args, message);
            else
                msg = "No help message was defined yet.";
            message.channel.send({
                embed: {
                    title: "Help for command `!" + command.toLowerCase() + "`",
                    color: 3447003,
                    description: msg
                }
            });
            message.delete();
            return;
        }

        let description = "For details on how to use a command, type `!help <command>`";

        for(let cmd in commands.cmds) {
            description += "\n`!" + cmd + "`";
        }

        message.channel.send({
            embed: {
                title: "List of my commands",
                color: 3447003,
                description: description
            }
        }).catch(e => logger.warn(e.message));
        message.delete();
    }
}

module.exports = Help;