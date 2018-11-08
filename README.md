# Avina
A Discord Bot which I use for my own Guild (as in Discord server, not some Game Guild)
Invite Avina to your server: https://discordapp.com/oauth2/authorize?client_id=382288187990736916&scope=bot

## Credits
I'd like to thank the following people for contributing! You've made my work here alot easier and provided useful input!
* **Noémi** for providing lots of command ideas, testing and contributing to Avina's personality! Thank you a lot!
* **[Project Sentinel](https://projectsentinel.home.blog/)** for using Avina in her early development stages to
help me test her and get useful insight in how she performs in action and what needs to be improved!
***Make sure to check them out if you like playing games and especially if you like playing with lots of awesome
people!***
* **[Shinico](https://github.com/Shinico)** for contributing a lot and keeping my motivation up to implement
layered architecture!

## Administrative stuff
Avina is intended to be a bot for a wide variety of tasks to improve users' Discord experience on your server. However,
the administrative commands are primarily intended to help you as an admin manage your users, roles and whatnot. Enjoy!

***WARNING: I do not recommend giving any bot Administrator permissions. Not even Avina. Not because I plan on
implementing functionality that wrecks your server, but because bugs happen and sometimes tend to do stuff like banning
all users including admins or stuff like that. Now, I'm really careful with my code and want to make sure, it works
before rolling out a new version, but sometimes I miss subtle details that might turn out fatal to something.***

### How Role Tags work
This section should hopefully explain to you how Avina manages roles, auto-detects role tags and reacts to users and
admins changing nicknames or roles. Roles with "Administrator" permission will not be touched, if Avina doesn't have the
same permission.

#### 1. Roles with Tags
So, the first thing you have to understand is, how Avina manages roles and what you have to do to make your roles
manageable for Avina.

Avina looks for roles with "tags". These roles look like this:

`[GA] Gamer` or `[ag] Awesome Guys`

As you can see, the tag is a 2 character text (preferrably for your users abbreviating the role name) and it is case
insensitive, so it doesn't matter whether they are upper- or lowercase or mixed case. Make sure, they are unique, as
Avina uses them as identifying IDs. Also, it is necessary to put them in brackets.

If a role's name doesn't have such a tag infront of it, Avina will ignore it.

#### 2. User Nickname Role Tags
Avina automatically puts tags infront of User's nicknames if their roles or their nickname change.

Now, she only puts one tag infront of the User's nickname and therefore she uses a little system do decide which tag to
choose.

First of all, if you want, you can have Avina only puts tags of roles, that have the `Display role members separately
from members` setting enabled and ignore other role tags. You can do that using the `!checkhoist` command.

From those roles, she chooses the one that is ranked highest in the roles list of the server.

If the user's nickname already has a tag infront of it's name that has a corresponding role on this server, that tag is
replaced by the new one. If not, Avina puts the new tag infront of the user's full current nickname.

### Commands
Here is a list of the commands that are already implemented.

* `!apply` command to apply for a role on a server. For this to work, it's important to put tags infront of roles, that
  users should be able to assume. The command's tag parameter is case insensitive and must not include the tag brackets
  []. Note that this doesn't work for roles with the Administrator permission, as I highly advise, never to give a bot
  Administrator rights! Not even your own bots! :D

  Usage example: `!apply gA` -> Saves a registration for the role with the tag [GA], if the user does not already have
  that role.
* `!approve` command to apply all roles one ore several users applied for them. Always check, what roles the users
  applied for before using this command! Only users with Administrator permission can use this command.
  
  Usage example: `!approve @AwesomeGuy @ThatDudeEveryoneTalksAbout` -> This will apply all the roles the users applied
  for to them and update their tags.
* `!disapprove` command to delete all role applications of one or several users. Only users with Administrator
  permission can use this command.

  Usage example: `!disapprove @AwesomeGuy @ThatDudeEveryoneTalksAbout`
* `!apps` command to list all current applications for roles. Only users with Administrator permission can use this
  command.

  Usage: `!apps`
* `!checkhoist` command to enable or disable checking of the `Display role members separately from members` property of
  roles when updating tags.

  Usage: `!checkhoist`
* `!updatetags` command to update all user nickname tags on your server according to their roles manually. Useful for
  when Avina has been down for maintenance, updates or similar things.

  Usage: `!updatetags`
* `!help` command to display a list of all commands.

  Usages: `!help` for a list of all commands, or `!help <command>` for detailed information on the given command.
* `!setwelcomemsg` command for admins only to set a welcome message for Avina to send in the channel, the command was
  used in every time a new user joins the server.

  Usage: `!setwelcomemsg <message>` where `<message>` can be really any text including mentions, emojis and Discord
  markup formatting.
* `!nowelcomemsg` command for admins only to tell Avina to stop sending welcome messages in the channel, the command was
  used in.

  Usage: `!nowelcomemsg`
* `!ignore` command for admins only to mark text-channels as "ignored" for Avina, meaning that she will not react to any
  commands of that channel except the `!ignore` command. She will still continue sending welcome messages in that
  channel if it was set up. To un-mark an "ignored" channel, simply use the `!ignore` command again.

  Usage: `!ignore`
## D&D
Yes, I use this bot for my D&D 5e Campaigns.

### Commands
Here is a list of the commands that are already implemented.

* `!roll` command to roll dice and return the total. This supports addition and subtraction of several dice and numbers!

  Usage examples: `!roll d20` or `!roll 4d6` or `!roll 2d20+5-2+3d6-d4`
* `!draw` command to draw a card of the default (22 cards) Deck of Many Things. Will send a picture of the drawn card to
  the user and a text description to the DM.

  Usage: `!draw [<game>]` where `<game>`  is the name of the game you're playing, that is required if you joined several 
  games on that server.
* `!rolls` command to roll several dice and return every result.

  Usage example: `!rolls 5d20+23` Possible output: `You rolled 35, 29, 42, 27, 43!`
* `!claimdm` command to claim DM status for a game and create the game if it doesn't already exist. If the game already
  exists, the claim request will be noted and when the current DM abandons the game, one of the requesters selected by
  the DM will be the new DM of the game. Fails, if the user currently is the DM of that game.
  
  Usage example: `!claimdm AwesomeGame` -> All Game Names will be changed to lowercase and spaces will cause the command
  to fail.
* `!abandondm`\
  Usage: `!abandondm [<game>] [<mention>]` where `<game>` is the optional name of the game and `<mention>` is an
  optional user mention e.g. @LeDude\
  If you are DM of a running game, this will make someone else the DM of it if only one user applied, or delete the game
  session if no user applied. If several users applied for the DM role, you need to mention one of them to make that
  user the new DM. If you are DMing several games on that server, you need to provide the game's name.
* `!joingame` command to join a running game. Fails, if the game doesn't exist, or the user is the DM of the game.

  Usage: `!joingame AwesomeGame` -> Will join the game 'awesomegame'.
* `!games` command to list the currently running games, their DMs and player counts.

  Usage: `!games`
* `!newquest` command to create a new quest for a game. User has to be a DM to use this command.

  Usage example: `!newquest Do Stuff` -> Will create a new open quest called "Do Stuff" with an ID Number for the game
  the user is DMing.
* `!removequest` command to remove a quest from a game. User hat to be a DM to use this command.

  Usage example: `!removequest 3` -> Will remove the quest with the ID number 3 from the game the user is currently
  DMing.
* `!completequest` command to mark a quest as completed/open. User has to be a DM to use this command.

  Usage example: `!completequest 2` -> Will mark the quest with the ID number 2 from the game the user is currently
  DMing as "completed" if the quest was open, or as "open" if the quest was completed.
* `!quests` command for listing the quests of a game.

  Usage example: `!quests foo` -> Will list all the quests of the game "foo" if it exists.

## Work in progress
Here is a list of features and commands that are going to be implemented or I'm even working on at the moment.

* `!imcallsuit` This command is going to be used for my 5e based, heavily homebrewed Avengers Campaign. Don't mind it
  being there. If you want to know how it works, ask me.
* `!initiative` command for rolling initiative in a D&D game.

  The idea is to have the DM of a game start initiative rounds and then the players can roll initiative by typing
  `!initiative [advantage | disadvantage] <modifier(s)>`. A DM should be able to roll initiative for NPCs using
  `!initiative [<npc name>] [advantage | disadvantage] [<modifier(s)>]`. Upon issuing the command to start the
  initiative round, A direct message containing the current initiative list of players and NPCs will be sent to the DM
  and that list will be updated everytime a player or the DM rolls initiative. Also, a player should not be able to
  re-roll his initiative unless the DM either starts a new initiative round or resets the initiative for the player.
* More smalltalk!

  You can actually contribute to Avina's smalltalk capabilities by creating pull requests for the
  [reactions.json](./util/reactions.json) file. I know, this is cheesy and lazy programming but maybe at one point I
  will have an actual machine learning based AI do the talking. But currently I don't have the time or the resources
  needed to implement this.
