# avina
A Discord Bot which I use for my own Guild (as in Discord server, not some Game Guild)
Invite Avina to your server: https://discordapp.com/oauth2/authorize?client_id=382288187990736916&scope=bot

## Credits
I'd like to thank the following people for contributing! You've made my work here alot easier and provided useful input!
* **Noémi** for providing lots of command ideas, testing and contributing to Avina's personality! Thank you alot! :)

## Administrative stuff
Avina is intended to be a bot for a wide variety of tasks to improve users' Discord experience on your server. However, the administrative commands are primarily intended to help you as an admin manage your users, roles and whatnot. Enjoy!

### Commands
Here is a list of the commands that are already implemented.

* `!apply` command to apply for a role on a server. For this to work, it's important to put tags infront of roles, that users should be
  able to assume. The command's tag parameter is case insensitive and must not include the tag brackets []. Note that this doesn't work
  for roles with the Administrator permission, as I highly advise, never to give a bot Administrator rights! Not even your own bots! :D

  Usage example: `!apply gA` -> Saves a registration for the role with the tag [GA], if the user does not already have that role.
* `!approve` command to apply all roles one ore several users applied for them. Always check, what roles the users applied for before
  using this command! Only users with Administrator permission can use this command.
  
  Usage example: `!approve @AwesomeGuy @ThatDudeEveryoneTalksAbout` -> This will apply all the roles the users applied for to them and
  update their tags.
* `!disapprove` command to delete all role applications of one or several users. Only users with Administrator permission can use this
  command.

  Usage example: `!disapprove @AwesomeGuy @ThatDudeEveryoneTalksAbout`
* `!apps` command to list all current applications for roles. Only users with Administrator permission can use this command.

  Usage: `!apps`
* `!save` command for saving the current data. Saved data will be loaded on (re-)start of the bot.

  Usage: `!save`

## D&D
Yes, I use this bot for my D&D 5e Campaigns.

### Commands
Here is a list of the commands that are already implemented.

* `!roll` command to roll dice and return the total. This supports addition and subtractuion of several dice and numbers!

  Usage examples: `!roll d20` or `!roll 4d6` or `!roll 2d20+5-2+3d6-d4`
* `!draw` command to draw a card of the default (22 cards) Deck of Many Things. Will send a picture of the drawn card to the user and a
  text description to the DM.

  Usage: `!draw`
* `!rolls` command to roll several dice and return every result.

  Usage example: `!rolls 5d20` Possible output: `You rolled 12, 6, 19, 4, 20!`
* `!claimdm` command to claim DM status for a game and create the game if it doesn't already exist. If the game already exists, the
  claim request will be noted and when the current DM abandons the game, the requester will be the new DM of the game. Fails, if the
  user currently is the DM of a game.
  
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
