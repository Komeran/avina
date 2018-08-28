import {BaseCommand} from "../util/BaseCommand";
import {Message} from "discord.js";

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
        message.reply("Test");
    }

    /**
     * @override
     * @type {string}
     */
    help = "This is a test";
}
