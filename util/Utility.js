import {Message} from "discord.js";

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
export class Utility {


    /**
     *
     * @param fromCh {number} Where the string chaining should start
     * @param toCh {number} Where the string chaining should end
     * @param args {array} String array to chain
     * @return {string} The chained string from fromCh to toCh
     */
    static addStringArguments(fromCh,toCh,args) {
        if(fromCh === undefined || fromCh === null) {
            fromCh=0;
        }
        if(args[fromCh] === null || args[fromCh]=== undefined) {
            return "Invalid";
        }
        if(toCh === undefined || toCh === null) {
            toCh=args.length;
        }
        if(args[toCh] === null || args[toCh]=== undefined) {
            return "Invalid";
        }
        let resultString = "";
        for(let i = fromCh; i < toCh; i++) {
            resultString += args[i];
        }
        return resultString;
    }
}
