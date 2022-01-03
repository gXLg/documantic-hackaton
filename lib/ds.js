const Rest = require("./rest.js");
const { WebSocket } = require("ws");

class Bot {
  constructor(token){
    this.cache = { };
    this.token = token;
    this.rest = new Rest(
      "https://discord.com/api/v9",
      { "Authorization": "Bot " + token }
    );
    this.events = { };
    this.sequence = null;
  }

  user(){
    return new Promise(async resolve => {
      resolve(this.cache.user ?? (
        this.cache.user = await this.rest.get("/users/@me")
      ));
    });
  }

  commands(){
    return new Promise(async resolve => {
      const user = await this.user();
      resolve(this.cache.commands ?? (
        this.cache.commands = await this.rest.get("/applications/" + user.id + "/commands")
      ));
    });
  }

  register_command(command){
    return new Promise(async resolve => {
      const user = await this.user();
      const commands = await this.commands();
      const result = await this.rest.post("/applications/" + user.id + "/commands", command);
      const same = commands.find(c => c.id == result.id);
      if(same) commands[commands.indexOf(same)] = result;
      resolve(result);
    });
  }

  async login(intents){
    const gateway = await this.rest.get("/gateway/bot");
    const sessions = gateway.session_start_limit;
    if(sessions.remaining == 0)
      throw new Error("Session limit reached, reset after " + sessions.reset_after)

    const url = new URL(gateway.url);
    url.searchParams.set("v", 9);
    url.searchParams.set("encoding", "json");

    function connect(bot, resume){
      bot.ws = new WebSocket(url.href);
      bot.ws.on("message", data => {
        const payload = JSON.parse(data);
        if(payload.s) bot.sequence = payload.s;
        const sendHeartbeat = ( ) => bot.ws.send(JSON.stringify({
          "op": 1,
          "d": bot.sequence
        }));
        if(payload.op == 1) sendHeartbeat();
        if(payload.op == 10){
          sendHeartbeat();
          bot.heart = setInterval(sendHeartbeat, payload.d.heartbeat_interval);

          if(resume){
            const resume = JSON.stringify({
              "op": 6,
              "d": {
                "token": bot.token,
                "session_id": bot.sessionId,
                "seq": bot.sequence
              }
            });
            bot.ws.send(resume);
            bot.recon = false;
          } else {
            const identify = JSON.stringify({
              "op": 2,
              "d": {
                intents,
                "token": bot.token,
                "properties": {
                  "$os": "linux",
                  "$browser": "node.js",
                  "$device": "calculator"
                }
              }
            });
            bot.ws.send(identify);
          }

        } else if(payload.op == 9){
          clearInterval(bot.heart);
          bot.ws.close();
          throw new Error("Invalid session!");
        } else if(payload.op == 7){
          bot.ws.close();
          bot.recon = true;
          connect(bot, true);
        } else if(payload.op == 0){
          //console.log("Event was dispatched", payload.t);
          if(payload.t == "READY") bot.sessionId = payload.d.session_id;
          (bot.events[payload.t] ?? (() => {}))(payload.d);
        }
      });
      bot.ws.on("close", code => {
        clearInterval(bot.heart);
      });
    }
    connect(this, false);
  }

  destroy(){
    this.ws.close(1000);
  }

  commands_deferred(id, token){
    return this.rest.post(
      "/interactions/" + id + "/" + token + "/callback",
      { "type": 5 }
    );
  }

  commands_edit_response(token, message){
    return this.rest.patch(
        "/webhooks/" + this.cache.user.id + "/" + token + "/messages/@original",
        message
    );
  }

}

module.exports = Bot;