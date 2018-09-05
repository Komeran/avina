/**
 * Mapped Guild Object
 * @author marc.schaefer
 * @date 27.08.2018
 * @param snowflake {string} The Snowflake ID of the Discord Guild
 * @param checkhoist {boolean}
 * @constructor
 */
export const Guild = function(snowflake, checkhoist) {
    this.snowflake = snowflake;
    this.checkhoist = checkhoist;
};
/**
 *
 * @static
 * @param snowflake {string} The Snowflake ID of the Discord Guild
 * @return {Guild} A Guild Object with default values for non-key parameters
 */
Guild.getDefault = function(snowflake) {
    return new Guild(snowflake, false);
};