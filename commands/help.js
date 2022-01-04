async function run(bot, data){
  const t = [
    "**:grin: About me**",
    "> I am a small discord bot with some minigames to make your day better.",
    "**:scroll: Credits**",
    "> Created by [/dev/null](https://discordapp.com/users/557260090621558805) " +
      "for Documantic Hackaton in January 2022",
    "> Event details: [Documantic discord server](https://discord.gg/7pbBEYAKCR)",
    "> Source code: [GitHub](https://github.com/gXLg/documantic-hackaton)"
  ].join("\n");
  const message = {
    "embeds": [
      {
        "description": t,
        "color": 0xFB3C02
      }
    ]
  };
  const result = await bot.commandsEditResponse(data.token, message);
}

module.exports = run;