import {MappedBaseClass} from "./MappedBaseClass";

/**
 * Mapped DnDGamePlayer Object
 * @author marc.schaefer
 * @date 29.08.2018
 * @implements MappedBaseClass
 */
export class DnDGamePlayer {
    /**
     *
     * @param playerSnowflake {string} The Snowflake ID of the Discord User who is the player
     * @param gameId {number} The DnD Game ID
     * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
     * @param active {boolean} Whether or not the player is active in the game right now
     */
    constructor(playerSnowflake, gameId, guildSnowflake, active) {
        this.playerSnowflake = playerSnowflake;
        this.gameId = gameId;
        this.guildSnowflake = guildSnowflake;
        this.active = active;
    }

    /**
     * The name of the table in the database this obejct reflects
     * @type {string}
     */
    static table = "dpl_dndgameplayers";

    /**
     * The mappings of the object fields to the table columns in the database
     * @type {{dpl_dp_u_dndplayer: string, dpl_d_dndgame: string, dpl_d_g_guild: string, dpl_active: string}}
     */
    static persistenceMapping = {
        "dpl_dp_u_dndplayer": "playerSnowflake",
        "dpl_d_dndgame": "gameId",
        "dpl_d_g_guild": "guildSnowflake",
        "dpl_active": "active"
    };
}