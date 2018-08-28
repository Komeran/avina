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
        let replyFunction;
        if(typeof message.channel === DmChannel) {
            replyFunction = function(m) {message.reply(m);};
        } else {
            replyFunction = function(m) {message.channel.send(m);};
        }
        if(args[2]) {
            let resultstring="Search results: ";
            let searchstring = Utility.addStringArguments(2,args.length,args);
            let js = pso2.getItem(searchstring);
            for(let i = 0; i < js.length;i++) {
                resultstring += js[i].JpName + " | " + js[i].EnName + "\n";
            }
            replyFunction(resultstring);
        }
        message.reply("Test");
    }

    /**
     * @override
     * @type {string}
     */
    help = "This is a test";


}
