import {BaseCommand} from "../util/BaseCommand";
import {Message} from "discord.js";
import  {DMChannel} from "discord.js";
import {TextChannel} from "discord.js";
import {Utility} from "../../util/Utility";

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
export class itemname extends BaseCommand {
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
        let replyFunction;
        if(message.guild) {
            replyFunction = function(m) {message.reply(m);};
        } else {
            replyFunction = function(m) {message.channel.send(m);};
        }
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
    help = "This is a test";


}
