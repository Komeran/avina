/**
 * @callback feedCallback
 * @callback subscribedCallback
 * @callback unsubscribedCallback
 */

let logger = require('winston');
let WarframeVersion = require('warframe-updates');
let warframeVersion = new WarframeVersion();
let WorldState = require('warframe-worldstate-parser');
let config = require('./config.json');
let guildSettings = require('./util/guildSettings.js');

/**
 *
 * @type {Object}
 * @private
 */
let _discordClient = null;
let _alertMessages = null;

warframeVersion.on("update", update => {
    logger.info("New Warframe Version: " + update.version + "\n" + update.title);
    for(let gid in guildSettings) {
        if(guildSettings[gid].warframe && guildSettings[gid].warframe.versionUpdateChannels){
            let channels = guildSettings[gid].warframe.versionUpdateChannels;
            for(let i = 0; i < channels.length; i++) {
                if(_discordClient.guilds.get(gid)) {
                    if(_discordClient.guilds.get(gid).channels.get(channels[i])) {
                        _discordClient.guilds.get(gid).channels.get(channels[i]).send({
                            embed: {
                                title: "New Warframe Version is out!",
                                description: '***"' + update.title + '"***',
                                color: 3447003,
                                fields: [
                                    {
                                        name: "Version:",
                                        value: update.version
                                    },
                                    {
                                        name: "Link:",
                                        value: update.link
                                    }
                                ]
                            }
                        });
                    }
                    else
                        guildSettings[gid].warframe.versionUpdateChannels.remove(channels[i]);
                }
            }
        }
    }
});

let client = null;

/**
 *
 * @param [discordClient] {Object}
 */
module.exports = function(discordClient) {
    if(!client) {
        if(!discordClient)
            throw Error("Need discordClient parameter for initialization!");
        client = new WarframeClient(discordClient);
    }
    return client;
};

class WarframeClient {

    /**
     *
     * @param discordClient {Object}
     * @param [alertMessages] {Object}
     */
    constructor(discordClient, alertMessages) {
        _discordClient = discordClient;
        _alertMessages = alertMessages;
        _recursiveAlertUpdater();
    }

    /**
     *
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     */
    subToWfUpdates(guildId, discordChannelId) {
        if(!guildSettings[guildId]) {
            guildSettings[guildId] = {
                warframe: {
                    versionUpdateChannels: []
                }
            };
        }
        if(!guildSettings[guildId].warframe) {
            guildSettings[guildId].warframe = {
                versionUpdateChannels: []
            };
        }
        if(!guildSettings[guildId].warframe.versionUpdateChannels) {
            guildSettings[guildId].warframe.versionUpdateChannels = [];
        }
        if(guildSettings[guildId].warframe.versionUpdateChannels.indexOf(discordChannelId) === -1) {
            guildSettings[guildId].warframe.versionUpdateChannels.push(discordChannelId);
        }
    }
    /**
     *
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @returns {boolean}
     */
    isSubbedToWfUpdates(guildId, discordChannelId) {
        return guildSettings[guildId]
            && guildSettings[guildId].warframe
            && guildSettings[guildId].warframe.versionUpdateChannels
            && guildSettings[guildId].warframe.versionUpdateChannels.indexOf(discordChannelId) !== -1;
    }
    /**
     *
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     */
    unsubWfUpdates(guildId, discordChannelId) {
        if(this.isSubbedToWfUpdates(guildId, discordChannelId)) {
            guildSettings[guildId].warframe.versionUpdateChannels.remove(discordChannelId);
        }
    }

    /**
     *
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     */
    subToAlerts(guildId, discordChannelId) {
        if(!guildSettings[guildId]) {
            guildSettings[guildId] = {
                warframe: {
                    alertChannels: []
                }
            };
        }
        if(!guildSettings[guildId].warframe) {
            guildSettings[guildId].warframe = {
                alertChannels: []
            };
        }
        if(!guildSettings[guildId].warframe.alertChannels) {
            guildSettings[guildId].warframe.alertChannels = [];
        }
        if(guildSettings[guildId].warframe.alertChannels.indexOf(discordChannelId) === -1) {
            guildSettings[guildId].warframe.alertChannels.push(discordChannelId);
        }
    }
    /**
     *
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     * @returns {boolean}
     */
    isSubbedToAlerts(guildId, discordChannelId) {
        return guildSettings[guildId]
            && guildSettings[guildId].warframe
            && guildSettings[guildId].warframe.alertChannels
            && guildSettings[guildId].warframe.alertChannels.indexOf(discordChannelId) !== -1;
    }
    /**
     *
     * @param guildId {(string|number)} The ID Snowflake of the Discord Guild
     * @param discordChannelId {(string|number)} The ID Snowflake of the Discord Channel
     */
    unsubAlerts(guildId, discordChannelId) {
        if(this.isSubbedToAlerts(guildId, discordChannelId)) {
            guildSettings[guildId].warframe.alertChannels.remove(discordChannelId);
        }
    }

    getAlertMessages() {
        return _alertMessages;
    }
}


/**
 *
 * @private
 */
function _recursiveAlertUpdater() {
    logger.debug("Fetching Warframe State...");
    require('request-promise')('http://content.warframe.com/dynamic/worldState.php').then(function(worldStateData) {
        let ws = new WorldState(worldStateData);

        logger.debug("Polled Alerts: " + ws.alerts.length);
        logger.debug("Guild Settings: " + Object.keys(guildSettings).length);

        for(let gid in guildSettings) {
            logger.debug("Guild: " + gid);
            logger.debug("Guild has Warframe Setting: " + !!guildSettings[gid].warframe);
            logger.debug("Guild has Alert Channels: " + (!!guildSettings[gid].warframe && !!guildSettings[gid].warframe.alertChannels));
            if(guildSettings[gid].warframe && guildSettings[gid].warframe.alertChannels){
                let channels = guildSettings[gid].warframe.alertChannels;
                logger.debug("Alert Channels: " + channels.length);
                for(let i = 0; i < channels.length; i++) {
                    logger.debug("Alert Channel: " + channels[i]);
                    logger.debug("Client Guilds: " + _discordClient.guilds.array().length);
                    let guild = _discordClient.guilds.get(gid);
                    logger.debug("Client has Guild: " + !!guild);
                    if(guild) {
                        let channel = guild.channels.get(channels[i]);
                        logger.debug("Guild has Channel: " + !!channel);
                        if(channel) {
                            logger.debug("Alert Message Channels: " + (_alertMessages? Object.keys(_alertMessages).length : 0));
                            logger.debug("Channel has Alert Messages: " + (!!_alertMessages && !!_alertMessages[channels[i]]));
                            if(_alertMessages && _alertMessages[channels[i]]) {
                                logger.debug("Channel Alert Messages: " + Object.keys(_alertMessages[channels[i]]).length);
                                let curAlerts = [];
                                for(let alert of ws.alerts) {
                                    curAlerts.push(alert.id);
                                }
                                for(let id in _alertMessages[channels[i]]) {
                                    if(curAlerts.indexOf(id) === -1) {
                                        channel.fetchMessage(_alertMessages[channels[i]][id])
                                            .then(message => message.delete())
                                            .catch(logger.error);
                                        delete _alertMessages[channels[i]][id];
                                    }
                                    else {
                                        for(let alert of ws.alerts) {
                                            if(alert.id === id) {
                                                channel.fetchMessage(_alertMessages[channels[i]][id])
                                                    .then(message => message.edit({
                                                        embed: {
                                                            title: "ALERT",
                                                            description: '**' + alert.mission.node + ' [' + alert.mission.type + ']**',
                                                            color: 3447003,
                                                            fields: [
                                                                {
                                                                    name: "Enemy:",
                                                                    value: alert.mission.faction + ' (Lv ' + alert.mission.minEnemyLevel + '-' + alert.mission.maxEnemyLevel + ')'
                                                                },
                                                                {
                                                                    name: "Reward:",
                                                                    value: alert.mission.reward.asString
                                                                },
                                                                {
                                                                    name: "Time left:",
                                                                    value: alert.eta || 'N/A'
                                                                }
                                                            ]
                                                        }
                                                    }))
                                                    .catch(function(err) {
                                                        logger.error(err);
                                                        delete _alertMessages[channels[i]][id];
                                                    });
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if(!_alertMessages)
                                _alertMessages = {};
                            for(let alert of ws.alerts) {
                                if(!_alertMessages[channels[i]])
                                    _alertMessages[channels[i]] = {};
                                logger.debug("Is new Alert: " + !_alertMessages[channels[i]][alert.id]);
                                if(!_alertMessages[channels[i]][alert.id]) {
                                    channel.send({
                                        embed: {
                                            title: "ALERT",
                                            description: '**' + alert.mission.node + ' [' + alert.mission.type + ']**',
                                            color: 3447003,
                                            fields: [
                                                {
                                                    name: "Enemy:",
                                                    value: alert.mission.faction + ' (Lv ' + alert.mission.minEnemyLevel + '-' + alert.mission.maxEnemyLevel + ')'
                                                },
                                                {
                                                    name: "Reward:",
                                                    value: alert.mission.reward.asString
                                                },
                                                {
                                                    name: "Time left:",
                                                    value: alert.eta || 'N/A'
                                                }
                                            ]
                                        }
                                    })
                                        .then(function(message) {
                                            _alertMessages[channels[i]][alert.id] = message.id
                                        })
                                        .catch(logger.error);
                                }
                            }
                        }
                        else {
                            guildSettings[gid].warframe.alertChannels.remove(channels[i]);
                        }
                    }
                }
            }
        }
        setTimeout(_recursiveAlertUpdater, (config && config.warframe && config.warframe.alertUpdateRate) ? config.warframe.alertUpdateRate : 30000);
    });
}