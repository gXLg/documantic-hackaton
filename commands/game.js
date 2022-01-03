async function run(bot, data){
  const message = {
    "embeds": [
      {
        "description": "Play message",
        "color": 0xFB3C02
      }
    ]
  };
  const result = await bot.commands_edit_response(data.token, message);
}

module.exports = run