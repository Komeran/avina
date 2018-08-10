/**
 * @callback feedCallback
 * @callback subscribedCallback
 * @callback unsubscribedCallback
 */

let pubSubHubbub = require("pubsubhubbub");
let pubSubSubscriber = pubSubHubbub.createServer({callbackUrl: "http://68.66.241.33:8080"});
let config = require("./config.json").googleapi.subscribe;
let parseString = require('xml2js').parseString;
let feedCallbacks = {};

pubSubSubscriber.on("subscribe", function(data){
    console.log(data.topic + " subscribed");
});

pubSubSubscriber.on("listen", function(){
    console.log("Listening on port %s", pubSubSubscriber.port);
});

pubSubSubscriber.on("feed", function(data) {
    console.log("Received feed");
    parseString(data.feed.toString(), function(err, result) {
        if(err) {
            console.log("INVALID FEED XML");
            return
        }
        if(feedCallbacks[data.feed.entry["yt:channelId"]]) {
            for(let cb of feedCallbacks[data.feed.entry["yt:channelId"]]) {
                cb(data.feed.entry);
            }
        }
    });
});

pubSubSubscriber.listen(config.port);

module.exports = {
    /**
     *
     * @param ytChannelId {string} The ID of the YouTube Channel
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @param feedCallback {feedCallback} The callback that should be called whenever a feed notification comes in.
     * @param [subscribedCallback] {subscribedCallback} The callback that should be called when the subscription process is done.
     */
    subscribeToYtChannel: function(ytChannelId, discordChannelId, feedCallback, subscribedCallback) {

        if(!feedCallbacks[ytChannelId]) {
            pubSubSubscriber.subscribe(config.topic + "?channel_id=" + ytChannelId, config.hub, function (err) {
                if (!err) {
                    feedCallbacks[ytChannelId] = {};
                    feedCallbacks[ytChannelId][discordChannelId] = feedCallback;
                }
                if (subscribedCallback)
                    subscribedCallback(err);
            });
        }
        else {
            feedCallbacks[ytChannelId][discordChannelId] = feedCallback;
            subscribedCallback();
        }
    },
    /**
     *
     * @param ytChannelId {string} The ID of the YouTube Channel
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @param [callback] {unsubscribedCallback} The callback that should be called when the unsubscribing process is done.
     */
    unsubscribe: function(ytChannelId, discordChannelId, callback) {
        if(feedCallbacks[ytChannelId] && feedCallbacks[ytChannelId][discordChannelId]) {
            delete feedCallbacks[ytChannelId][discordChannelId];
            if(feedCallbacks[ytChannelId].keyArray().length === 0) {
                delete feedCallbacks[ytChannelId];
                pubSubSubscriber.unsubscribe(config.topic + "?channel_id=" + ytChannelId, config.hub, callback);
            }
        }
    }
};