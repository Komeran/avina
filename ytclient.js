/**
 * @callback subscribedCallback
 * @callback unsubscribedCallback
 */

let pubSubHubbub = require("pubsubhubbub");
let pubSubSubscriber = pubSubHubbub.createServer({callbackUrl: "http://68.66.241.33:8080"});
let logger = require('winston');
let config = require("./config.json").googleapi.subscribe;
let parseString = require('xml2js').parseString;
let guildSettings = require('./util/guildSettings.js');
let feedCallbacks = {}; // TODO: DELETE
let notifyChannels = {};
let _discordClient = null;

pubSubSubscriber.on("listen", function(){
    console.log("Listening on port %s", pubSubSubscriber.port);
});

pubSubSubscriber.on("feed", function(data) {
    logger.debug("Received YouTube Notification Feed");
    parseString(data.feed.toString(), function(err, result) {
        if(err) {
            console.log("INVALID FEED XML");
            return
        }
        let ytChannelId = result.feed.entry["yt:channelId"];
        logger.debug("YouTube Channel ID: " + ytChannelId);
    });
});

pubSubSubscriber.listen(config.port);

let _instance = null;

/**
 *
 * @param [discordClient] {Client}
 */
module.exports = function(discordClient) {
    if(!_instance){
        if(!discordClient)
            throw Error("Need discordClient parameter for initialization!");
        _instance = new YouTubeClient(discordClient);
    }
    return _instance;
};

class YouTubeClient {
    /**
     *
     * @param [discordClient] {Client}
     */
    constructor(discordClient) {
        _discordClient = discordClient;
    }

    /**
     *
     * @param ytChannelId {string} The ID of the YouTube Channel
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @param query {Query}
     * @param [subscribedCallback] {subscribedCallback} The callback that should be called when the subscription process is done.
     */
    subscribeToYtChannel(guildId, discordChannelId, query, subscribedCallback) {
        subscribe(guildId, discordChannelId, query.ytChannelId, query, subscribedCallback);
    }
    /**
     *
     * @param ytChannelId {string} The ID of the YouTube Channel
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @returns {boolean}
     */
    isSubscribedToYtChannel(ytChannelId, guildId, discordChannelId) {
        guildId = '' + guildId;
        discordChannelId = '' + discordChannelId;
        return !!guildSettings[guildId]
            && !!guildSettings[guildId].youtube
            && !!guildSettings[guildId].youtube.subscribeChannels
            && !!guildSettings[guildId].youtube.subscribeChannels[discordChannelId]
            && !!guildSettings[guildId].youtube.subscribeChannels[discordChannelId][ytChannelId];
    }
    /**
     *
     * @param ytChannelId {string} The ID of the YouTube Channel
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @param unsubscribedCallback {unsubscribedCallback}
     */
    unsubYtChannel(ytChannelId, guildId, discordChannelId, unsubscribedCallback) {
        guildId = '' + guildId;
        discordChannelId = '' + discordChannelId;
        unsubscribe(guildId, discordChannelId, ytChannelId, unsubscribedCallback);
    }
    /**
     *
     * @param ytChannelId {string} The ID of the YouTube Channel
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @param unsubscribedCallback {unsubscribedCallback}
     */
    unsubAllYtChannels(guildId, discordChannelId, unsubscribedCallback) {
        guildId = '' + guildId;
        discordChannelId = '' + discordChannelId;
        if(guildSettings[guildId] && guildSettings[guildId].youtube && guildSettings[guildId].youtube.subscribeChannels && guildSettings[guildId].youtube.subscribeChannels[discordChannelId]) {
            let unsubCount = 0;
            let lastErr = null;
            let unsubComplete = function(err) {
                unsubCount++;
                if(err)
                    lastErr = err;
                if(unsubCount === Object.keys(guildSettings[guildId].youtube.subscribeChannels[discordChannelId]).length && unsubscribedCallback)
                    unsubscribedCallback(lastErr);
            };
            for(let ytChannelId in guildSettings[guildId].youtube.subscribeChannels[discordChannelId]) {
                unsubscribe(guildId, discordChannelId, ytChannelId, unsubComplete);
            }
        }
    }

    /**
     *
     * @param ytChannelId {string}
     * @returns {Query}
     */
    getQuery(ytChannelId) {
        return new Query(ytChannelId);
    }
    /**
     *
     * @param [ytChannelId] {string}
     * @returns {StopQuery}
     */
    getStopQuery(ytChannelId) {
        return new StopQuery(ytChannelId);
    }
    /**
     *
     * @param [ytChannelId] {string}
     * @param titleString {string}
     * @param contains {boolean}
     * @param is {boolean}
     * @param not {boolean}
     * @returns {TitleQuery}
     */
    getTitleQuery(ytChannelId, titleString, contains, is, not) {
        return new TitleQuery(ytChannelId, titleString, contains, is, not);
    }
}

/**
 *
 * @param [ytChannelId] {string}
 * @constructor
 */
function Query(ytChannelId) {
    this.ytChannelId = ytChannelId;
}
class TitleQuery extends Query {
    /**
     *
     * @param ytChannelId {string}
     * @param titleString {string}
     * @param contains {boolean}
     * @param is {boolean}
     * @param not {boolean}
     */
    constructor(ytChannelId, titleString, contains, is, not) {
        super(ytChannelId);
        this.titleString = titleString;
        this.contains = contains;
        this.is = is;
        this.not = not;
    }
}
class StopQuery extends Query {
    constructor(ytChannelId) {
        super(ytChannelId);
    }
}

/**
 *
 * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
 * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
 * @param ytChannelId {string} The ID of the YouTube Channel
 * @param query {Query}
 * @param [callback] {subscribedCallback} The callback that should be called when the subscription process is done.
 */
function subscribe(guildId, discordChannelId, ytChannelId, query, callback) {
    if(!guildSettings[guildId])
        guildSettings[guildId] = {};
    if(!guildSettings[guildId].youtube)
        guildSettings[guildId].youtube = {};
    if(!guildSettings[guildId].youtube.subscribeChannels)
        guildSettings[guildId].youtube.subscribeChannels = {};
    if(!guildSettings[guildId].youtube.subscribeChannels[discordChannelId])
        guildSettings[guildId].youtube.subscribeChannels[discordChannelId] = {};

    pubSubSubscriber.subscribe(config.topic + "?channel_id=" + ytChannelId, config.hub, function (err) {
        if (!err) {
            guildSettings[guildId].youtube.subscribeChannels[discordChannelId][ytChannelId] = query;
        }
        if (callback)
            callback(err);
    });
}
/**
 *
 * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
 * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
 * @param ytChannelId {string} The ID of the YouTube Channel
 * @param [callback] {unsubscribedCallback} The callback that should be called when the unsubscribe process is done.
 */
function unsubscribe(guildId, discordChannelId, ytChannelId, callback) {
    pubSubSubscriber.unsubscribe(config.topic + "?channel_id=" + ytChannelId, config.hub, function (err) {
        if (!err && guildSettings[guildId] && guildSettings[guildId].youtube && guildSettings[guildId].youtube.subscribeChannels && guildSettings[guildId].youtube.subscribeChannels[discordChannelId] && guildSettings[guildId].youtube.subscribeChannels[discordChannelId][ytChannelId]) {
            delete guildSettings[guildId].youtube.subscribeChannels[discordChannelId][ytChannelId];
        }
        if(callback)
            callback(err);
    });
}