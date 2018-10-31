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
//let guildSettings = require('./util/guildSettings.js');
let dbClient = require('./databaseClient.js');
let Guild = require('./databaseClient.js').Guild;
let TextChannel = require('./databaseClient.js').TextChannel;
let Message = require('./databaseClient.js').Message;
let DiscordClient = require('discord.js').Client;

/**
 *
 * @type {Object}
 * @private
 */
let _discordClient = null;

warframeVersion.on("update", update => {
    logger.info("New Warframe Version: " + update.version + "\n" + update.title);
    dbClient.getWfUpdateTextChannels().then(
        /**
         *
         * @param channels {TextChannel[]}
         */
        function(channels) {
            channels.forEach(function(channel) {
                let guild = _discordClient.guilds.get(channel.guildSnowflake);
                if(!guild) {
                    // Guild doesn't exist anymore. Delete everything of it from the database...
                    dbClient.deleteGuilds(Guild.getDefault(channel.guildSnowflake));
                    return;
                }
                let textChannel = guild.channels.get(channel.snowflake);
                if(!textChannel) {
                    // The text channel doesn't exist anymore. Delete everything of it from the database...
                    dbClient.deleteTextChannels(channel);
                    return;
                }
                textChannel.send({
                    embed: {
                        title: "A new Warframe Version is out!",
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
            });
        }
    );
});

let client = null;

/**
 *
 * @param [discordClient] {DiscordClient}
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
     * @param discordClient {DiscordClient}
     */
    constructor(discordClient) {
        _discordClient = discordClient;
        _recursiveAlertUpdater();
    }

    /**
     *
     * @param guildId {string} The ID Snowflake of the Discord Guild
     * @param discordChannelId {string} The ID Snowflake of the Discord Channel
     * @async
     * @return {Promise<void>}
     */
    static async subToWfUpdates(guildId, discordChannelId) {
        await dbClient.addGuilds(true, Guild.getDefault(guildId));

        let textChannel = await dbClient.getTextChannel(discordChannelId);
        textChannel = textChannel || TextChannel.getDefault(discordChannelId, guildId);
        textChannel.updateWarframeVersion = true;
        await dbClient.addTextChannels(false, textChannel);
    }
    /**
     *
     * @param discordChannelId {string} The ID Snowflake of the Discord Channel
     * @returns {Promise<boolean>}
     */
    static async isSubbedToWfUpdates(discordChannelId) {
        let textChannel = await dbClient.getTextChannel(discordChannelId);
        return !!textChannel && textChannel.updateWarframeVersion;
    }
    /**
     *
     * @param discordChannelId {string} The ID Snowflake of the Discord Channel
     * @async
     * @return {Promise<void>}
     */
    static async unsubWfUpdates(discordChannelId) {
        let textChannel = await dbClient.getTextChannel(discordChannelId);
        if(textChannel) {
            textChannel.updateWarframeVersion = false;
            await dbClient.addTextChannels(false, textChannel);
        }
    }

    /**
     *
     * @param guildId {string} The ID Snowflake of the Discord Guild
     * @param discordChannelId {string} The ID Snowflake of the Discord Channel
     * @async
     * @return {Promise<void>}
     */
    static async subToAlerts(guildId, discordChannelId) {
        // Make sure the Guild is saved
        await dbClient.addGuilds(true, Guild.getDefault(guildId));

        // Get the existing TextChannel save data if it exists, or create a new one otherwise
        let textChannel = await dbClient.getTextChannel(discordChannelId);
        console.log("textChannel", textChannel);
        textChannel = textChannel || TextChannel.getDefault(discordChannelId, guildId);

        // Mark the text channel for alert notifications
        textChannel.notifyWarframeAlerts = true;
        console.log("textChannel", textChannel);

        // Force update the text channel
        await dbClient.addTextChannels(false, textChannel);
    }
    /**
     *
     * @param discordChannelId {string} The ID Snowflake of the Discord Channel
     * @returns {Promise<boolean>}
     * @async
     */
    static async isSubbedToAlerts(discordChannelId) {
        let textChannel = await dbClient.getTextChannel(discordChannelId);
        return !!textChannel && textChannel.notifyWarframeAlerts;
    }
    /**
     *
     * @param discordChannelId {string} The ID Snowflake of the Discord Channel
     */
    static async unsubAlerts(discordChannelId) {
        let textChannel = await dbClient.getTextChannel(discordChannelId);
        if(textChannel) {
            textChannel.notifyWarframeAlerts = false;
            await dbClient.addTextChannels(false, textChannel);
        }
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


        dbClient.getAllAlertMessages().then(function(messages) {
            if(!messages || messages.length === 0)
                return;
            let existingAlerts = {};
            let messagesToRemove = [];
            // Handle existing alert messages first
            messages.forEach(function(message) {
                let discordMessage = _discordClient.messages.get(message.snowflake);
                if(discordMessage) {
                    for(let alert of ws.alerts) {
                        if(alert.id === message.wfAlertMessage) {
                            discordMessage.edit({
                                embed: {
                                    title: "ALERT",
                                    description: '**' + alert.mission.node + ' [' + alert.mission.type + ']**',
                                    color: 3447003,
                                    thumbnail: {
                                        url: alert.mission.reward.thumbnail
                                    },
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
                            });
                            existingAlerts[discordMessage.guild.id] = existingAlerts[discordMessage.guild.id] || [];
                            existingAlerts[discordMessage.guild.id].push(alert.id);
                            return;
                        }
                    }
                    discordMessage.delete();
                    messagesToRemove.push(message);
                }
                else {
                    messagesToRemove.push(message);
                }
            });

            let channelsToRemove = [];

            // Now send new ones where needed.
            dbClient.getWarframeAlertTextChannels().then(function(textChannels) {
                if(!textChannels || textChannels.length === 0)
                    return;

                textChannels.forEach(function(textChannel) {
                    let discordChannel = _discordClient.channels.get(textChannel.snowflake);
                    if(discordChannel) {
                        for(let alert of ws.alerts) {
                            if(existingAlerts[textChannel.guildSnowflake].indexOf(alert.id) !== -1)
                                continue;
                            discordChannel.send({
                                embed: {
                                    title: "ALERT",
                                    description: '**' + alert.mission.node + ' [' + alert.mission.type + ']**',
                                    color: 3447003,
                                    thumbnail: {
                                        url: alert.mission.reward.thumbnail
                                    },
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
                            }).then(function(msg) {
                                dbClient.addMessages(new Message(msg.id, alert.id, textChannel.snowflake, textChannel.guildSnowflake));
                            });
                        }
                    }
                    else {
                        channelsToRemove.push(textChannel);
                    }
                });
                // Make sure to delete the channels and messages from the database that now don't exist anymore
                dbClient.deleteTextChannels(...channelsToRemove);
                dbClient.deleteMessages(...messagesToRemove);
            })
        });
        setTimeout(_recursiveAlertUpdater, (config && config.warframe && config.warframe.alertUpdateRate) ? config.warframe.alertUpdateRate : 30000);
    });
}