/**
 * @author marc.schaefer
 * @date 21.08.2018
 */

let mysqlConfig = require("./config.json").database || {
    "host": "127.0.0.1",
    "user": "avina",
    "password": "",
    "database": "Avina"
};
let mysql = require('mysql');
let dbConnection = mysql.createConnection(mysqlConfig);

console.log("Connecting to database...");

dbConnection.connect(function(err) {
    if(err) {
        console.log(err);
        return;
    }
    console.log("Successfully connected to database!");

    console.log("Getting User Info...");
});

module.exports = {
    /**
     * Retrieves saved information of a user
     * @param snowflake {string} The snowflake ID of the user
     * @async
     */
    getUser: async function(snowflake) {
        return await query("SELECT * FROM u_users where u_snowflake = '" + snowflake + "';");
    },
    /**
     * Retrieves saved information of a guild
     * @param snowflake {string} The snowflake ID of the guild
     * @async
     */
    getGuild: async function(snowflake) {
        return await query("SELECT * FROM g_guilds where g_snowflake = '" + snowflake + "';");
    },
    /**
     * Retrieves saved information of a text channel
     * @param snowflake {string} The snowflake ID of the text channel
     * @async
     */
    getTextChannel: async function(snowflake) {
        return await query("SELECT * FROM t_textchannels where t_snowflake = '" + snowflake + "';");
    },
    /**
     * Retrieves saved information of a message
     * @param snowflake {string} The snowflake ID of the message
     * @async
     */
    getMessage: async function(snowflake) {
        return await query("SELECT * FROM m_messages where m_snowflake = '" + snowflake + "';");
    },
    /**
     * Retrieves saved role applications of a user in a guild
     * @param userSnowflake {string} The snowflake ID of the user
     * @param guildSnowflake {string} The snowflake ID of the guild
     * @async
     */
    getApplications: async function(userSnowflake, guildSnowflake) {
        return await query("SELECT * FROM a_applications where a_g_guild = '" + guildSnowflake + "' and a_u_user = '" + userSnowflake + "';");
    },
    /**
     * Retrieves saved dnd games of a guild
     * @param snowflake {string} The snowflake ID of the guild
     * @async
     */
    getDnDGames: async function(snowflake) {
        return await query("SELECT * FROM d_dndgames where d_g_guild = '" + snowflake + ";");
    },
    /**
     * Retrieves a saved dnd game of a guild
     * @param snowflake {string} The snowflake ID of the guild
     * @param id {number} The ID of the game
     * @async
     */
    getDnDGame: async function(snowflake, id) {
        return await query("SELECT * FROM d_dndgames where d_g_guild = '" + snowflake + " and d_id = " + id + ";");
    },
    /**
     * Retrieves saved quests of a dnd game
     * @param snowflake {string} The snowflake ID of the guild
     * @param id {number} The ID of the game
     * @async
     */
    getDnDQuests: async function(snowflake, id) {
        return await query("SELECT * FROM dq_dndquests where dq_d_g_guild = '" + snowflake + " and dq_d_dndgame = " + id + ";");
    },
    /**
     * Retrieves a saved quest of a dnd game
     * @param snowflake {string} The snowflake ID of the guild
     * @param gameId {number} The ID of the game
     * @param questId {number} The ID of the game
     * @async
     */
    getDnDQuest: async function(snowflake, gameId, questId) {
        return await query("SELECT * FROM dq_dndquests where dq_d_g_guild = '" + snowflake + " and dq_d_dndgame = " + gameId + " and dq_id = " + questId + ";");
    }
};

/**
 *
 * @param queryString {string}
 * @returns {Promise<any>}
 */
let query = function(queryString) {
    return new Promise(resolve => dbConnection.query(queryString, function(error, result, fields) {
        if(error) {
            resolve(error);
            return;
        }
        if(result[0]) {
            resolve(result);
            return;
        }
        resolve();
    }));
};