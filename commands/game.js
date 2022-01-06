async function run(bot, data, require_){
  const options = {};
  data.data.options.forEach(o => options[o.name] = o.value);

  const message = {
    "embeds": [
      {
        "description": null,
        "color": 0xFB3C02
      }
    ]
  };

  if(options.action == "action_rules"){
    if(options.game == "game_mastermind"){
      const t = [
        "**:brain: Mastermind**",
        "> Mastermind is a code-breaking game for two players (here you will play against the bot).",
        "> The modern game with pegs was invented in 1970 by Mordecai Meirowitz, an Israeli postmaster and telecommunications expert.",
        "> It resembles an earlier pencil and paper game called Bulls and Cows that may date back a century.",
        "**:pencil: Gameplay and rules**",
        "> Setup of the game is a decoding board (the message), a codemaker (the bot) " +
        "and the codebreaker (you). The board has 10 rows wtih 4 holes next to each row.",
        "> The codemaker comes up with a code, which consists of 4 unrepititive colors.",
        "> Your task is to guess the code, both the colors and the order.",
        "> Each guess is made by putting 4 colors and receiving feedback from the codemaker.",
        "> The feedback is made in the 4 small holes next to the row. " +
        "One white point means, there is one color right," +
        " but in the wrong position. One black point means, " +
        "there is one color on the right place.",
        "> If you achieve to get four black points, you win.",
        "**:video_game: Control**",
        "> <:mmc_0:927557120814100501>-<:mmc_5:927557480299507712> - put color",
        "> <:mmc_n:927557525929345064> - delete last input color",
        "> :ballot_box_with_check: - submit a guess",
        "> :no_entry_sign: - cancel the game"
      ].join("\n");

      message.embeds[0].description = t;
      const result = await bot.commandsEditResponse(data.token, message);
      return;
    } else if(options.game == "game_rubiks"){
      const t = [
        "**:game_die: Rubik's Cube**",
        "> This 3D puzzle was invented by Ernő Rubik in 1974 and is still " +
        "popular nowadays.",
        "**:pencil: Gameplay and Rules**",
        "> Try to solve the cube. There are a lot of tutorials on the internet.",
        "**:video_game: Control**",
        "> ."
      ].join("\n");

      message.embeds[0].description = t;
      const result = await bot.commandsEditResponse(data.token, message);
      result;
    }
  } else if(options.action == "action_play"){
    const game = options.game.split("_")[1];
    require_("./commands/games/" + game)(bot, data, message);
  }
}

module.exports = run;