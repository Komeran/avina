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
        //TODO: CALL RIGHT CALLBACKS IN feedCallbacks
        console.log("entry", result.feed.entry);
    });
});

pubSubSubscriber.listen(config.port);

module.exports = {
    subscribeToYtChannel: function(channel_id, callback) {
        pubSubSubscriber.subscribe(config.topic + "?channel_id=" + channel_id, config.hub, function(err){
            if(err){
                console.log(err);
            }
            //TODO: ADD callback TO feedCallbacks
        });


    },
    unsubscribe: function(channel_id, callback) {
        pubSubSubscriber.unsubscribe(config.topic + "?channel_id=" + channel_id, config.hub, function(err){
            if(err){
                console.log(err);
            }
            //TODO: REMOVE ALL CALLBACKS FOR channel_id FROM feedCallbacks AND CALL callback WHEN DONE
        });
    }
};

// ------------------------------------------------------TEST-----------------------------------------------------------
require('./testyt.js').subscribeToYtChannel("UCzBuFb39m4DW_vSZhTHhiXQ", function() {
    require('./testyt.js').unsubscribe("UCzBuFb39m4DW_vSZhTHhiXQ");
});