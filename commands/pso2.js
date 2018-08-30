import {ParentCommand} from "../util/ParentCommand";

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
export class pso2 extends ParentCommand {


    subCommandDirectory="custom_command_logic/pso2";

    /**
     * @override
     * @type {function}
     */
    help = function(args, message) {
        if(args[2] !== null && args[2] !== undefined && this.subCommands[args[2]] !== undefined && this.subCommands[args[2]] !== null) {
            return this.subCommands[args[2]].help;
        } else {
            return "`!pso2 [itemname|shop] (<arguments>)` in order to execute the corresponding command for the game pso2.\n"+
                "use `!help pso2 [itemname|shop] (<arguments>)` in order to receive help for the corresponding command.";
        }
    }

    static async getItem(inp) {
        let itemn = inp;
        let res= await pso2.returnJson(itemn);
        return res;
    }

    static returnJson(itemname) {
        return new Promise(function(resolve) {
            request(`http://db.kakia.org/item/search?name=${encodeURIComponent(itemname)}`, function(e,r,dom) {
                if(!e && r.statusCode === 200) {
                    let result = JSON.parse(dom);
                    resolve(result);
                } else resolve(false);
            });
        });
    }

}
