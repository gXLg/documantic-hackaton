(async () => {

  function require_(module){
    delete require.cache[require.resolve(module)];
    return require(module);
  }

  const fs = require("fs");
  const token = fs.readFileSync(".token", "UTF-8");

  const ds = require("./lib/ds.js");
  const bot = new ds.Bot(token);

  const me = await bot.user();
  console.log("Logging in as " + me.username + "...");

  bot.events["READY"] = data => {
    console.log("Bot logged in!");
  }

  bot.events["INTERACTION_CREATE"] = async data => {
    if(data.application_id != me.id) return;
    if(!data.data.name) return;
    await bot.commandsDeferred(data.id, data.token);
    require_("./commands/" + data.data.name)(bot, data)
  }

  bot.login(1 << 10);

})();