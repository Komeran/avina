/**
 * @author marc.schaefer
 * @date 24.08.2018
 */

module.exports = {
    execute: function (args, message) {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
                .then(function(list){
                    message.channel.bulkDelete(list);
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    },
    help: ""
};