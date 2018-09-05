/**
 * Mapped Filter Object
 * @author marc.schaefer
 * @date 27.08.2018
 * @param id {number} The ID of the filter
 * @param channelId {string} The ID of the YouTube Channel
 * @param textChannelSnowflake {string} The Snowflake ID of the Discord Text Channel
 * @param attribute {string} The attribute to filter
 * @param value {string} The value to filter for
 * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
 * @constructor
 */
export const Filter = function(id, channelId, textChannelSnowflake, attribute, value, guildSnowflake) {
    this.id = id;
    this.channelId = channelId;
    this.textChannelSnowflake = textChannelSnowflake;
    this.attribute = attribute;
    this.value = value;
    this.guildSnowflake = guildSnowflake;
};