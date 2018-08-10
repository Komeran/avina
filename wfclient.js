/**
 * @callback feedCallback
 * @callback subscribedCallback
 * @callback unsubscribedCallback
 */

let logger = require('winston');
let WarframeVersion = require('warframe-updates');
let warframeVersion = new WarframeVersion();

let versionUpdateCallbacks = {};

warframeVersion.on("update", update => {
    for(let cb of versionUpdateCallbacks) {
        cb(update);
        logger.info("New Warframe Version: " + update.version + "\n" + update.title);
    }
});

module.exports = {
    /**
     *
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @param feedCallback {feedCallback} The callback that should be called whenever a feed notification comes in.
     * @param [subscribedCallback] {subscribedCallback} The callback that should be called when the subscription process is done.
     * @return {boolean} true if it worked, false if this discord channel already subscribed to Warframe Updates.
     */
    subToWfUpdates: function(discordChannelId, feedCallback, subscribedCallback) {
        if(!versionUpdateCallbacks[discordChannelId]) {
            versionUpdateCallbacks[discordChannelId] = feedCallback;
            if(subscribedCallback)
                subscribedCallback(true);
            return true;
        }
        else {
            if(subscribedCallback)
                subscribedCallback(false);
            return false;
        }
    },
    /**
     *
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @returns {boolean}
     */
    isSubbedToWfUpdates: function(discordChannelId) {
        return !!versionUpdateCallbacks[discordChannelId];
    },
    /**
     *
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @param [callback] {unsubscribedCallback} The callback that should be called when the unsubscribing process is done.
     */
    unsubWfUpdates: function(discordChannelId, callback) {
        if(versionUpdateCallbacks[discordChannelId]) {
            delete versionUpdateCallbacks[discordChannelId];
            if(callback)
                callback(true);
            return true;
        }
        else {
            if(callback)
                callback(false);
            return false;
        }
    }
};