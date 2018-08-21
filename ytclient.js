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
let notifyChannels = {};
let _discordClient = null;

pubSubSubscriber.on("listen", function(){
    console.log("Listening on port %s", pubSubSubscriber.port);
});

pubSubSubscriber.on("feed", function(data) {
    parseString(data.feed.toString(), function(err, result) {
        if(err) {
            console.log("INVALID FEED XML");
            return
        }
        if (!result.feed.entry || !result.feed.entry[0])
            return;
        let entry = result.feed.entry[0];
        let ytChannelId = entry["yt:channelId"][0];
        let author = entry["author"][0].name[0];
        let videoLink = entry["link"][0].$.href;
        let videoTitle = entry["title"][0];
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
        if(!this.isSubscribedToYtChannel(ytChannelId))
        subscribe(guildId, discordChannelId, query.ytChannelId, query, subscribedCallback);
    }
    /**
     * Checks whether the YouTubeClient instance has already subscribed to the given YouTube Channel
     * @param ytChannelId {string} The ID of the YouTube Channel
     * @returns {boolean}
     */
    isSubscribedToYtChannel(ytChannelId) {
        for(let gid in guildSettings) {
            if(!guildSettings[gid].youtube || !guildSettings[gid].youtube.subscribeChannels)
                continue;
            for(let dcid in guildSettings[gid].youtube.subscribeChannels) {
                if(guildSettings[gid].youtube.subscribeChannels[ytChannelId])
                    return true;
            }
        }
        return false;
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
 * Subscribes to a YouTube Channel.
 * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
 * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
 * @param ytChannelId {string} The ID of the YouTube Channel
 * @param query {Query}
 * @param [callback] {subscribedCallback} The callback that should be called when the subscription process is done.
 */
function subscribe(ytChannelId, callback) {
    for(let gid in guildSettings) {
        if(!guildSettings[gid].youtube || !guildSettings[gid].youtube.subscribeChannels)
            continue;
        for(let dcid in guildSettings[gid].youtube.subscribeChannels) {
            if(guildSettings[gid].youtube.subscribeChannels[dcid][ytChannelId]) {
                if(callback) {
                    callback(new Error("Already subscribed to " + ytChannelId + "!"));
                }
                return;
            }
        }
    }
    pubSubSubscriber.subscribe(config.topic + "?channel_id=" + ytChannelId, config.hub, function (err) {
        if (callback)
            callback(err);
    });
}
/**
 * Unsubscribes from a YouTube Channel and drops all saved notification queries for said channel.
 * @param ytChannelId {string} The ID of the YouTube Channel
 * @param [callback] {unsubscribedCallback} The callback that should be called when the unsubscribe process is done.
 */
function unsubscribe(ytChannelId, callback) {
    pubSubSubscriber.unsubscribe(config.topic + "?channel_id=" + ytChannelId, config.hub, function (err) {
        // In case we successfully unsubscribed, make sure we delete all notification instances! This is to reduce cluttering.
        if (!err && guildSettings[guildId] && guildSettings[guildId].youtube && guildSettings[guildId].youtube.subscribeChannels && guildSettings[guildId].youtube.subscribeChannels[discordChannelId] && guildSettings[guildId].youtube.subscribeChannels[discordChannelId][ytChannelId]) {
            for(let gid in guildSettings) {
                if(!guildSettings[gid].youtube || !guildSettings[gid].youtube.subscribeChannels)
                    continue;
                for(let dcid in guildSettings[gid].youtube.subscribeChannels) {
                    if(guildSettings[gid].youtube.subscribeChannels[dcid][ytChannelId]) {
                        delete guildSettings[gid].youtube.subscribeChannels[dcid][ytChannelId];
                    }
                }
            }
        }
        if(callback)
            callback(err);
    });
}