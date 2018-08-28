import {ParentCommand} from "../util/ParentCommand";
import {Message} from "discord.js";

let logger = require('winston');

/**
 * @author nico.faderbauer
 * @date 28.08.2018
 */
export class pso2 extends ParentCommand {


    subCommandDirectory="custom_command_logic/pso2";

    /**
     * @override
     * @type {string}
     */
    help = "`!pso2 [item|itemname|shop] (<arguments>)` in order to receive the corresponding command for the game pso2.\n"+
    "use `pso2 [item|itemname|shop] (<arguments>)` in order to receive help for the corresponding command.";
}
