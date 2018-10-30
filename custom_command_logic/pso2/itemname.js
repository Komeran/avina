const BaseCommand = require("../../util/BaseCommand").BaseCommand;
const Message = require("discord.js").Message;
const Utility = require("../../util/Utility").Utility;

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
class itemname extends BaseCommand {
    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        let embed = {
            color: 3447003,
            title: "Search results:",
            fields: []
        }
        let replyFunction = function(m) {message.channel.send(m);};
        if(args[2]) {
            let searchstring = Utility.addStringArguments(2,args.length,args);
            let js = pso2.getItem(searchstring);
            for(let i = 0; i < js.length;i++) {
                embed.fields.push({
                    name: "Result " + (i+1),
                    value: js[i].JpName + " | " + js[i].EnName
                });
            }
            replyFunction({embed: embed});
        }
    }

    /**
     * @override
     * @type {string}
     */
    help = "Use `!pso2 itemname <itemname>` in order to get the japanese or english name for everything including this one.";


}
