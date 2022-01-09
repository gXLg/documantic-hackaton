async function run(bot, data, message){

  // lookup table for rating emoji
  const lur = {
    "00": "927547151783964772",
    "01": "927552743076417577",
    "02": "927552804069998642",
    "03": "927552861838123028",
    "04": "927553094496190534",
    "10": "927547254791880805",
    "11": "927553145876402186",
    "12": "927553194740043826",
    "13": "927553254232055808",
    "20": "927552238895915018",
    "21": "927553319692537929",
    "22": "927553404425883658",
    "30": "927552351835930734",
    "31": "927553466006642748",
    "40": "927552622808940575",
     "n": "927560848766021642"
  };

  // lookup table for color emoji
  const luc = {
    "0": "927557120814100501",
    "1": "927557185628672060",
    "2": "927557243833044993",
    "3": "927557308643442689",
    "4": "927557426503352351",
    "5": "927557480299507712",
    "n": "927557525929345064"
  };

  // the game board
  const board = [
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],

    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],

    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],

    [-1, -1, -1, -1, -1]
  ];
  const cur = [9, 0];

  // translate board into text for message
  function gett(text){
    const t = ["**:brain: Mastermind**", text || "\n"];
    for(let line of board){
      const i = [];
      for(let j of line.slice(0, 4)){
        const k = ~j ? j : "n";
        i.push("<:mmc_" + k + ":" + luc[k] + ">");
      }
      const k = ~line[4] ? line[4] : "n";
      i.push("<:mm_" + k + ":" + lur[k] + ">");
      t.push(i.join(""));
    }
    return t.join("\n");
  }

  // the bots picks up a combination
  const game = [0, 1, 2, 3, 4, 5];
  const thought = [];
  thought.push(...game.splice(Math.floor(Math.random() * game.length), 1));
  thought.push(...game.splice(Math.floor(Math.random() * game.length), 1));
  thought.push(...game.splice(Math.floor(Math.random() * game.length), 1));
  thought.push(...game.splice(Math.floor(Math.random() * game.length), 1));

  // buttons for the message
  const comp = [
    {
      "type" : 1, "components": [
        {
          "type": 2, "style": 2, "custom_id": "color_0",
          "emoji": { "id": luc["0"], "name": "nmc_0" }
        },
        {
          "type": 2, "style": 2, "custom_id": "color_1",
          "emoji": { "id": luc["1"], "name": "nmc_1" }
        },
        {
          "type": 2, "style": 2, "custom_id": "color_2",
          "emoji": { "id": luc["2"], "name": "nmc_2" }
        }
      ]
    },
    {
      "type" : 1, "components": [
        {
          "type": 2, "style": 2, "custom_id": "color_3",
          "emoji": { "id": luc["3"], "name": "nmc_3" }
        },
        {
          "type": 2, "style": 2, "custom_id": "color_4",
          "emoji": { "id": luc["4"], "name": "nmc_4" }
        },
        {
          "type": 2, "style": 2, "custom_id": "color_5",
          "emoji": { "id": luc["5"], "name": "nmc_5" }
        }
      ]
    },
    {
      "type" : 1, "components": [
        {
          "type": 2, "style": 1, "disabled": true, "custom_id": "delete",
          "emoji" : { "id": luc["n"], "name": "nmc_n" }
        },
        {
          "type": 2, "style": 3, "disabled": true, "custom_id": "submit",
          "emoji": { "id": null, "name": "☑" }
        },
        {
          "type": 2, "style": 4, "custom_id": "cancel",
          "emoji": { "id": null, "name": "🚫" }
        }
      ]
    }
  ];
  message.embeds[0].description = gett();
  message.components = comp;

  //const result = await bot.commandsEditResponse(data.token, message);
  await bot.commandsResponse(data.id, data.token, message);
  const result = await bot.commandsGetResponse(data.token);
  //console.log(result);
  const mid = result.id;
  const cid = result.channel_id;

  // if for some reason not sent
  if(!mid) throw new Error(JSON.stringify(result));

  let finish = false;
  while(true){
    // listening for each button press
    const button = await bot.listenOnce(
      "INTERACTION_CREATE",
      data => (
        (data.message?.id == mid) &&
        (data.channel_id == cid) &&
        (data.data?.component_type == 2) &&
        (data.member?.user?.id == result.interaction.user.id)
      ),
      15 * 60000
    );
    if(!button) break;

    //await bot.commandsDeferredWithCom(button.id, button.token);
    const name = button.data.custom_id;
    if(name == "delete"){
      if(cur[1] == 0) continue;
      cur[1]--;
      const x = board[cur[0]][cur[1]];
      message.components[Math.floor(x / 3)].components[x % 3].disabled = false;
      board[cur[0]][cur[1]] = -1;
      message.components[2].components[1].disabled = true;
      if(cur[1] == 0)
        message.components[2].components[0].disabled = true;

    } else if(name == "submit"){
      if(cur[1] != 4) continue;
      const compare = board[cur[0]];
      let white = [...compare];
      let w = 0;
      let b = 0;
      for(let i of [0, 1, 2, 3]){
        if(compare[i] == thought[i]) {
          b++;
          white = white.filter(p => p != compare[i]);
        }
      }
      for(let i of white) if(thought.includes(i)) w++;

      board[cur[0]][4] = b + "" + w;

      if(b == 4){
        finish = true;
        break;
      }

      cur[0]--;
      cur[1] = 0;

      if(cur[0] < 0){
        finish = true;
        break;
      }

      message.components[2].components[1].disabled = true;
      message.components[2].components[0].disabled = true;

      message.components[0].components[0].disabled = false;
      message.components[0].components[1].disabled = false;
      message.components[0].components[2].disabled = false;
      message.components[1].components[0].disabled = false;
      message.components[1].components[1].disabled = false;
      message.components[1].components[2].disabled = false;

    } else if(name == "cancel"){
      break;
    } else {
      if(cur[1] == 4) continue;
      const x = parseInt(name.slice(-1));
      board[cur[0]][cur[1]] = x;
      cur[1]++;
      message.components[Math.floor(x / 3)].components[x % 3].disabled = true;
      if(cur[1] == 4){
        message.components[2].components[1].disabled = false;

        message.components[0].components[0].disabled = true;
        message.components[0].components[1].disabled = true;
        message.components[0].components[2].disabled = true;
        message.components[1].components[0].disabled = true;
        message.components[1].components[1].disabled = true;
        message.components[1].components[2].disabled = true;
      }
      message.components[2].components[0].disabled = false;
    }

    message.embeds[0].description = gett();
    //await bot.commandsEditResponse(button.token, message);
    await bot.commandsComResponse(button.id, button.token, message);

  }

  // closing the game
  if(finish){
    if(cur[0] < 0){
      board.splice(0, 10, [...thought, -1]);
      message.embeds[0].description = gett("> You lost, the combination was:");
    } else {
      board.splice(0, cur[0]);
      message.embeds[0].description = gett("> You won and could guess the combination in " + (10 - cur[0]) + " steps!");
    }

  } else {
    message.embeds[0].description = "Game closed";
  }
  message.components = [];
  await bot.editMessage(cid, mid, message);
}

module.exports = run;