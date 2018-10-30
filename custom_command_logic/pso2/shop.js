const BaseCommand = require("../../util/BaseCommand.js").BaseCommand;
const Message = require("discord.js").Message;
const Utility = require("../../util/Utility").Utility;

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 30.08.2018
 */
class shop extends BaseCommand {
    /**
     * @override
     * @param args {string[]} arguments from the parent Command
     * @param message {Message}
     */
    execute(args, message) {
        let embed = {
            color: 3447003,
            title: "Search results:",
            fields: []
        }
        let replyFunction;
        if(message.guild) {
            replyFunction = function(m) {message.reply(m);};
        } else {
            replyFunction = function(m) {message.channel.send(m);};
        }
        if(args[2]) {
            let searchstring = Utility.addStringArguments(2,args.length,args);
            let js = pso2.getItem(searchstring);
            embed.fields.push({name:"Item:", value:js[0].EnName + " | " + js[0].JpName});
            for(let j = 0; j < js[0].PriceInfo.length; j++) {
                embed.fields.push({
                    name:"Ship " + js[0].PriceInfo[j].Ship,
                    value: "Price: "+ js[0].PriceInfo[j].Price+" Meseta  |  Last Update:" + js[0].PriceInfo[j].LastUpdated
                });
            }
            replyFunction({embed: embed});
        }
    }

    /**
     * @override
     * @type {string}
     * Help Text of this command.
     */
    help = "Use `!pso2 shop <itemname>` in order to find the cheapest shop prices of a certain item for all ships.";
}
