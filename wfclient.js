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
                if(_discordClient.guilds[gid]) {
                    if(_discordClient.guilds[gid].channels[channels[i]]) {
                        _discordClient.guilds[gid].channels[channels[i]].send({
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
                else
                    delete guildSettings[gid];
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
     */
    constructor(discordClient) {
        _discordClient = discordClient;
        _alertMessages = {};
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
        if(this.isSubbedToWfUpdates(guildId, discordChannelId)) {
            guildSettings[guildId].warframe.versionUpdateChannels.remove(discordChannelId);
        }
    }
}


/**
 *
 * @private
 */
function _recursiveAlertUpdater() {
    require('request-promise')('http://content.warframe.com/dynamic/worldState.php').then(function(worldStateData) {
        let ws = new WorldState(worldStateData);

        logger.debug("Polled Alerts:", ws.alerts);

        for(let gid in guildSettings) {
            if(guildSettings[gid].warframe && guildSettings[gid].warframe.alertChannels){
                let channels = guildSettings[gid].warframe.alertChannels;
                for(let i = 0; i < channels.length; i++) {
                    if(_discordClient.guilds[gid]) {
                        if(_discordClient.guilds[gid].channels[channels[i]]) {
                            if(_alertMessages[channels[i]]) {
                                let curAlerts = [];
                                for(let alert of ws.alerts) {
                                    curAlerts.push(alert.id);
                                }
                                for(let id in _alertMessages[channels[i]]) {
                                    if(curAlerts.indexOf(id) === -1) {
                                        _discordClient.guilds[gid].channels[channels[i]].fetchMessage(_alertMessages[channels[i]][id])
                                            .then(message => message.delete())
                                            .catch(logger.error);
                                        delete _alertMessages[channels[i]][id];
                                    }
                                    else {
                                        for(let alert of ws.alerts) {
                                            if(alert.id === id) {
                                                _discordClient.guilds[gid].channels[channels[i]].fetchMessage(_alertMessages[channels[i]][id])
                                                    .then(message => message.edit({
                                                        embed: {
                                                            title: "ALERT",
                                                            description: '**' + alert.mission.node + ' (' + alert.mission.type + ')**',
                                                            color: 3447003,
                                                            fields: [
                                                                {
                                                                    name: "Enemy Level:",
                                                                    value: alert.mission.minEnemyLevel + '-' + alert.mission.maxEnemyLevel
                                                                },
                                                                {
                                                                    name: "Faction:",
                                                                    value: alert.mission.faction
                                                                },
                                                                {
                                                                    name: "Reward:",
                                                                    value: alert.mission.reward.asString
                                                                },
                                                                {
                                                                    name: "Waves:",
                                                                    value: alert.mission.maxWaveNum
                                                                }
                                                            ]
                                                        }
                                                    }))
                                                    .catch(logger.error);
                                                break;
                                            }
                                        }
                                    }
                                }
                                for(let alert of ws.alerts) {
                                    if(!_alertMessages[channels[i]][alert.id]) {
                                        _discordClient.guilds[gid].channels[channels[i]].send({
                                            embed: {
                                                title: "ALERT",
                                                description: '**' + alert.mission.node + ' (' + alert.mission.type + ')**',
                                                color: 3447003,
                                                fields: [
                                                    {
                                                        name: "Enemy Level:",
                                                        value: alert.mission.minEnemyLevel + '-' + alert.mission.maxEnemyLevel
                                                    },
                                                    {
                                                        name: "Faction:",
                                                        value: alert.mission.faction
                                                    },
                                                    {
                                                        name: "Reward:",
                                                        value: alert.mission.reward.asString
                                                    },
                                                    {
                                                        name: "Waves:",
                                                        value: alert.mission.maxWaveNum
                                                    }
                                                ]
                                            }
                                        })
                                            .then(message => _alertMessages[channels[i]][alert.id] = message.id);
                                    }
                                }
                            }
                        }
                        else
                            guildSettings[gid].warframe.alertChannels.remove(channels[i]);
                    }
                    else
                        delete guildSettings[gid];
                }
            }
        }
        setTimeout(_recursiveAlertUpdater, config && config.warframe && config.warframe.alertUpdateRate ? config.warframe.alertUpdateRate : 60000);
    });
}