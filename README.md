# avina
A Discord Bot which I use for my own Guild (as in Discord server, not some Game Guild)
Invite Avina to your server: https://discordapp.com/oauth2/authorize?client_id=382288187990736916&scope=bot

## D&D
Yes, I use this bot for my D&D 5e Campaigns.

### Commands
Here is a list of the commands that are already implemented.

* `!roll` command to roll dice and return the total. This supports addition and subtractuion of several dice and numbers!

  Usage examples: `!roll d20` or `!roll 4d6` or `!roll 2d20+5-2+3d6-d4`
* `!draw` command to draw a card of the default (22 cards) Deck of Many Things. Will send a picture of the drawn card to the user and a
  text description to the DM (Claiming DM is WIP).

  Usage: `!draw`
* `!rolls` command to roll several dice and return every result.

  Usage example: `!rolls 5d20` Possible output: `You rolled 12, 6, 19, 4, 20!`
* `!claimdm` command to claim DM status for a game and create the game if it doesn't already exist. If the game already exists, the
  claim request will be noted and when the current DM abandons the game, the requester will be the new DM of the game. Fails, if the user
  currently is the DM of a game.
  
  Usage example: `!claimdm AwesomeGame` -> All Game Names will be changed to lowercase and spaces will cause the command to fail.
* `!abandondm` command to abandon DM status of the current game and delete the game instance if nobody else requested DM status for it.

  Usage: `!abandondm`
* `!joingame` command to join a running game. Fails, if the game doesn't exist, or the user is the DM of the game.

  Usage: `!joingame AwesomeGame` -> Will join the game 'awesomegame'.
* `!games` command to list the currently running games, their DMs and player counts.

  Usage: `!games`
* `!newquest` command to create a new quest for a game. User has to be a DM to use this command.

  Usage example: `!newquest Do Stuff` -> Will create a new open quest called "Do Stuff" with an ID Number for the game the user is
  DMing.
* `!removequest` command to remove a quest from a game. User hat to be a DM to use this command.

  Usage example: `!removequest 3` -> Will remove the quest with the ID number 3 from the game the user is currently DMing.
* `!completequest` command to mark a quest as completed/open. User has to be a DM to use this command.

  Usage example: `!completequest 2` -> Will mark the quest with the ID number 2 from the game the user is currently DMing as "completed"
  if the quest was open, or as "open" if the quest was completed.
* `!quests` command for listing the quests of a game.

  Usage example: `!quests foo` -> Will list all the quests of the game "foo" if it exists.
* `!save` command for saving the current games data. Saved data will be loaded on (re-)start of the bot.

  Usage: `!save`
