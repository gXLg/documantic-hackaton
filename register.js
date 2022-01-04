(async () => {

  const fs = require("fs");
  const token = fs.readFileSync(".token");

  const ds = require("./lib/ds.js");
  const bot = new ds.Bot(token);

  const me = await bot.user();
  console.log("Registering commands for " + me.username);

  const slash = require("./commands/slash.json");
  for(command of slash){

    const result = await bot.register_command(command);

    if(result.id){
      console.log("\x1b[32m'" + command.name + "' registered successfully with id " + result.id + "\x1b[m");
    } else {
      console.log("\x1b[31m'" + command.name + "' failed to register: " + JSON.stringify(result) + "\x1b[m");
    }
  }
})();