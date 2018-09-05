import {MappedBaseClass} from "./MappedBaseClass";

/**
 * Mapped Notification Object
 * @author marc.schaefer
 * @date 27.08.2018
 * @implements MappedBaseClass
 */
export class Notification {
    /**
     *
     * @param channelId {string} The ID of the YouTube Channel
     * @param textChannelSnowflake {string} The Snowflake ID of the Discord Text Channel
     * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
     * @param [filterLogic] {string} The Filter Logic presented as string
     */
    constructor(channelId, textChannelSnowflake, guildSnowflake, filterLogic) {
        this.channelId = channelId;
        this.textChannelSnowflake = textChannelSnowflake;
        this.guildSnowflake = guildSnowflake;
        this.filterLogic = filterLogic || null;
    }
}