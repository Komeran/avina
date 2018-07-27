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
