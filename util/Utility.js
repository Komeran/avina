let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
class Utility {
    /**
     *
     * @param fromCh {number} Where the string chaining should start
     * @param toCh {number} Where the string chaining should end
     * @param args {array} String array to chain
     * @return {string} The chained string from fromCh to toCh
     */
    static addStringArguments(fromCh,toCh,args) {
        fromCh = fromCh || 0;
        if(!args[fromCh]) {
            return "Invalid";
        }
        toCh = toCh || args.length-1;
        if(!args[toCh]) {
            return "Invalid";
        }
        let resultString = args[fromCh];
        for(let i = fromCh+1; i < toCh; i++) {
            resultString += " " + args[i];
        }
        return resultString;
    }
}

module.exports = Utility;