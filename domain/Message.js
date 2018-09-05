import {MappedBaseClass} from "./MappedBaseClass";

/**
 * Mapped Message Object
 * @author marc.schaefer
 * @date 27.08.2018
 * @implements MappedBaseClass
 */
export class Message {
    /**
     *
     * @param snowflake {string} The Snowflake ID of the Discord Message
     * @param textChannelSnowflake {string} The Snowflake ID of the Discord Text Channel
     * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
     * @param [wfAlertMessage] {boolean}
     */
    constructor(snowflake, textChannelSnowflake, guildSnowflake, wfAlertMessage) {
        this.snowflake = snowflake;
        this.textChannelSnowflake = textChannelSnowflake;
        this.guildSnowflake = guildSnowflake;
        this.wfAlertMessage = wfAlertMessage || false;
    }
}