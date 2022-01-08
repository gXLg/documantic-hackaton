# Documantic Hackaton Bot
A discord bot for Documantic Hackaton.
The task was to create a bot with minigames.

# Usage
1) Create and invite bot with `3072` permission.
2) Clone the repo and put bot token into the file `.token`
3) Setup the emojis, because they are private
4) Register the slash commands with `node register.js`
5) Start the bot with `node .`

The dependencies are the `ws`, and `https` modules.

# Games
As already mentioned, bot's main feature is a collection
of minigames. As for the time of hackaton, only 2 games
have been made. To play a game use
`/game game:<game> action:action_play`. To read game rules use
`/game game:<game> action:action_rules`.

All buttons timeout after 15 minutes of inactivity
on a message.

## Mastermind
An old puzzle game about decoding a color combination.

## Rubik's Cube
A real rubik's cube sent as a message, to rurn around,
scramble and solve.