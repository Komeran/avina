/**
 * @author marc.schaefer
 * @date 14.11.2018
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

    console.log("Testing...");

    let testString = encodeURI("Test String 🇬");

    console.log("Setting to:", testString);


        query("SELECT * FROM t_textchannels WHERE t_snowflake = '376105297057677322';").then(function(results) {
            if(results) {
                let encodedMsgs = [];
                results.forEach(function(channel) {
                    encodedMsgs.push(encodeURI(channel.t_welcomeMessage));
                });
                query("UPDATE t_textchannels SET t_welcomeMessage = '" + encodeURI(encodedMsgs[0]) + "' WHERE t_snowflake = '376105297057677322';").then(function() {
                    console.log("DONE");
                }).catch(console.error);
                return;
            }
            console.log("No results!");
        }).catch(console.error);


});

let query = function(queryString) {
    return new Promise(resolve => dbConnection.query(queryString, function(error, result, fields) {
        if(result && result[0]) {
            resolve(result);
            return;
        }
        if(error) {
            resolve(error);
        }
        resolve();
    }));
};

