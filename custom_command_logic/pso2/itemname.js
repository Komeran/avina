const BaseCommand = require("../../util/BaseCommand");
const Message = require("discord.js").Message;
const Utility = require("../../util/Utility");
const pso2 = require("../../commands/pso2");

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
        };
        console.log("itemname was called!");
        let replyFunction = function(m) {message.channel.send(m);};
        if(args[2]) {
            let searchstring = Utility.addStringArguments(2,args.length,args);
            pso2.getItem(searchstring).then(function(js) {
                for(let i = 0; i < js.length;i++) {
                    embed.fields.push({
                        name: "Result " + (i+1),
                        value: js[i].JpName + " | " + js[i].EnName
                    });
                }
                replyFunction({embed: embed});
            });
        }
    }
}

/**
 * @override
 * @type {string}
 */
itemname.help = "Use `!pso2 itemname <itemname>` in order to get the japanese or english name for everything including this one.";

module.exports = itemname;