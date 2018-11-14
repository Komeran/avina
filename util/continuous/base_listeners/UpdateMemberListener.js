const BaseContinuous = require("../BaseContinuous");
const GuildMember = require("discord.js").GuildMember;

/**
 * Executes when a guild member has been updated
 * @author marc.schaefer
 * @date 14.11.2018
 */
class UpdateMemberListener extends BaseContinuous {
    /**
     * Constructor
     */
    constructor() {
        super("guildMemberUpdate");
    }

    /**
     * This is called whenever a guild member has been updated
     * @param oldMember {GuildMember}
     * @param newMember {GuildMember}
     * @abstract
     */
    execute(oldMember, newMember) {
        throw new Error("abstract function yo");
    }
}

module.exports = UpdateMemberListener;