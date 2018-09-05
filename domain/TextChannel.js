import {MappedBaseClass} from "./MappedBaseClass";

/**
 * Mapped Text Channel Object
 * @author marc.schaefer
 * @date 27.08.2018
 * @implements MappedBaseClass
 */
export class TextChannel {
    /**
     *
     * @param snowflake {string} The Snowflake ID of the Discord Text Channel
     * @param guildSnowflake] {string} The Snowflake ID of the Discord Guild this text channel is in
     * @param [welcomeMessage] {string} The Welcome Message of the text channel
     * @param [ignoreCommands] {boolean}
     * @param [updateWarframeVersion] {boolean}
     * @param [notifyWarframeAlerts] {boolean}
     */
    constructor(snowflake, guildSnowflake, welcomeMessage, ignoreCommands, updateWarframeVersion, notifyWarframeAlerts) {
        this.snowflake = snowflake;
        this.guildSnowflake = guildSnowflake;
        this.welcomeMessage = welcomeMessage || null;
        this.ignoreCommands = ignoreCommands || false;
        this.updateWarframeVersion = updateWarframeVersion || false;
        this.notifyWarframeAlerts = notifyWarframeAlerts || false;
    }
}