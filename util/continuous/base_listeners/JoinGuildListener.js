const BaseContinuous = require("../BaseContinuous");
const GuildMember = require("discord.js").GuildMember;

/**
 * Executes when a new discord user joins a guild
 * @author marc.schaefer
 * @date 14.11.2018
 */
class JoinGuildListener extends BaseContinuous {
    /**
     * Constructor
     */
    constructor() {
        super("guildMemberAdd");
    }

    /**
     * This is called whenever a new user joins a Guild that Avina is in
     * @param member {GuildMember}
     * @abstract
     */
    execute(member) {
        throw new Error("abstract function yo");
    }
}

module.exports = JoinGuildListener;