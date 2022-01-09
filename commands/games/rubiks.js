async function run(bot, data, message){

  // color lookup
  const luc = ["white_large", "yellow", "orange", "red", "blue", "green"];
  const lue = ["⬜", "🟨", "🟧", "🟥", "🟦", "🟩"];

  const cube = {
    "F": [4, 4, 4, 4, 4, 4, 4, 4, 4],
    "U": [1, 1, 1, 1, 1, 1, 1, 1, 1],
    "L": [2, 2, 2, 2, 2, 2, 2, 2, 2],
    "B": [5, 5, 5, 5, 5, 5, 5, 5, 5],
    "D": [0, 0, 0, 0, 0, 0, 0, 0, 0],
    "R": [3, 3, 3, 3, 3, 3, 3, 3, 3]
  };

  function gett(){

    // cube object with emojis instead of color codes
    const cubeEmoji = {};

    for(let side in cube){
      cubeEmoji[side] = [];
      for(let piece of cube[side]){
        cubeEmoji[side].push(":" + luc[piece] + "_square:");
      }
    }

    const t = ["**:game_die: Rubik's Cube**"];
    let cubeText = `
                                         | B | B | B |
                                         | B | B | B |
                                         | B | B | B |
                                       /U/U/U/
                                   /U/U/U/
                               /U/U/U/
| L | L | L | | F | F | F | | R | R | R |
| L | L | L | | F | F | F | | R | R | R |
| L | L | L | | F | F | F | | R | R | R |
                              | D | D | D |
                              | D | D | D |
                              | D | D | D |`;
    for(let side in cubeEmoji){
      for(let piece of cubeEmoji[side]){
        cubeText = cubeText.replace(side, piece);
      }
    }
    t.push(cubeText);
    return t.join("\n");
  }

  // moves

  function front(){
    const F = [...cube.F];
    const U = [...cube.U];
    const L = [...cube.L];
    const D = [...cube.D];
    const R = [...cube.R];
    const t = [...U];
    cube.F = [F[6], F[3], F[0],
              F[7], F[4], F[1],
              F[8], F[5], F[2]];
    [U[6], U[7], U[8]] = [L[8], L[5], L[2]];
    [L[8], L[5], L[2]] = [D[2], D[1], D[0]];
    [D[2], D[1], D[0]] = [R[0], R[3], R[6]];
    [R[0], R[3], R[6]] = [t[6], t[7], t[8]];
    cube.U = U;
    cube.L = L;
    cube.D = D;
    cube.R = R;
  }

  function up(){
    const U = [...cube.U];
    const L = [...cube.L];
    const F = [...cube.F];
    const R = [...cube.R];
    const B = [...cube.B];
    const t = [...L];
    cube.U = [U[6], U[3], U[0],
              U[7], U[4], U[1],
              U[8], U[5], U[2]];
    [L[0], L[1], L[2]] = [F[0], F[1], F[2]];
    [F[0], F[1], F[2]] = [R[0], R[1], R[2]];
    [R[0], R[1], R[2]] = [B[8], B[7], B[6]];
    [B[8], B[7], B[6]] = [t[0], t[1], t[2]];
    cube.L = L;
    cube.F = F;
    cube.R = R;
    cube.B = B;
  }

  function left(){
    const L = [...cube.L];
    const U = [...cube.U];
    const B = [...cube.B];
    const D = [...cube.D];
    const F = [...cube.F];
    const t = [...U];
    cube.L = [L[6], L[3], L[0],
              L[7], L[4], L[1],
              L[8], L[5], L[2]];
    [U[0], U[3], U[6]] = [B[0], B[3], B[6]];
    [B[0], B[3], B[6]] = [D[0], D[3], D[6]];
    [D[0], D[3], D[6]] = [F[0], F[3], F[6]];
    [F[0], F[3], F[6]] = [t[0], t[3], t[6]];
    cube.U = U;
    cube.B = B;
    cube.D = D;
    cube.F = F;
  }

  function back(){
    const B = [...cube.B];
    const U = [...cube.U];
    const R = [...cube.R];
    const D = [...cube.D];
    const L = [...cube.L];
    const t = [...U];
    cube.B = [B[6], B[3], B[0],
              B[7], B[4], B[1],
              B[8], B[5], B[2]];
    [U[0], U[1], U[2]] = [R[2], R[5], R[8]];
    [R[2], R[5], R[8]] = [D[8], D[7], D[6]];
    [D[8], D[7], D[6]] = [L[6], L[3], L[0]];
    [L[6], L[3], L[0]] = [t[0], t[1], t[2]];
    cube.U = U;
    cube.R = R;
    cube.D = D;
    cube.L = L;
  }

  function down(){
    const D = [...cube.D];
    const L = [...cube.L];
    const B = [...cube.B];
    const R = [...cube.R];
    const F = [...cube.F];
    const t = [...L];
    cube.D = [D[6], D[3], D[0],
              D[7], D[4], D[1],
              D[8], D[5], D[2]];
    [L[6], L[7], L[8]] = [B[2], B[1], B[0]];
    [B[2], B[1], B[0]] = [R[6], R[7], R[8]];
    [R[6], R[7], R[8]] = [F[6], F[7], F[8]];
    [F[6], F[7], F[8]] = [t[6], t[7], t[8]];
    cube.L = L;
    cube.B = B;
    cube.R = R;
    cube.F = F;
  }

  function right(){
    const R = [...cube.R];
    const U = [...cube.U];
    const F = [...cube.F];
    const D = [...cube.D];
    const B = [...cube.B];
    const t = [...U];
    cube.R = [R[6], R[3], R[0],
              R[7], R[4], R[1],
              R[8], R[5], R[2]];
    [U[2], U[5], U[8]] = [F[2], F[5], F[8]];
    [F[2], F[5], F[8]] = [D[2], D[5], D[8]];
    [D[2], D[5], D[8]] = [B[2], B[5], B[8]];
    [B[2], B[5], B[8]] = [t[2], t[5], t[8]];
    cube.U = U;
    cube.F = F;
    cube.D = D;
    cube.B = B;
  }

  const comp = [
    {
      "type": 1, "components": [
        {
          "type": 2, "style": 2, "custom_id": "turn_front",
          "label": "F", "emoji": { "name": lue[cube.F[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "turn_up",
          "label": "U", "emoji": { "name": lue[cube.U[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "turn_left",
          "label": "L", "emoji": { "name": lue[cube.L[4]] }
        }
      ]
    },
    {
      "type": 1, "components": [
        {
          "type": 2, "style": 2, "custom_id": "cturn_front",
          "label": "F'", "emoji": { "name": lue[cube.F[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "cturn_up",
          "label": "U'", "emoji": { "name": lue[cube.U[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "cturn_left",
          "label": "L'", "emoji": { "name": lue[cube.L[4]] }
        }
      ]
    },
    {
      "type": 1, "components": [
        {
          "type": 2, "style": 2, "custom_id": "turn_back",
          "label": "B", "emoji": { "name": lue[cube.B[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "turn_down",
          "label": "D", "emoji": { "name": lue[cube.D[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "turn_right",
          "label": "R", "emoji": { "name": lue[cube.R[4]] }
        }
      ]
    },
    {
      "type": 1, "components": [
        {
          "type": 2, "style": 2, "custom_id": "cturn_back",
          "label": "B'", "emoji": { "name": lue[cube.B[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "cturn_down",
          "label": "D'", "emoji": { "name": lue[cube.D[4]] }
        },
        {
          "type": 2, "style": 2, "custom_id": "cturn_right",
          "label": "R'", "emoji": { "name": lue[cube.R[4]] }
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

    if(name == "turn_front"){
      front();
    } else if(name == "cturn_front"){
      front();
      front();
      front();
    } else if(name == "turn_up"){
      up();
    } else if(name == "cturn_up"){
      up();
      up();
      up();
    } else if(name == "turn_left"){
      left();
    } else if(name == "cturn_left"){
      left();
      left();
      left();
    } else if(name == "turn_back"){
      back();
    } else if(name == "cturn_back"){
      back();
      back();
      back();
    } else if(name == "turn_down"){
      down();
    } else if(name == "cturn_down"){
      down();
      down();
      down();
    } else if(name == "turn_right"){
      right();
    } else if(name == "cturn_right"){
      right();
      right();
      right();
    }

    message.embeds[0].description = gett();
    //await bot.commandsEditResponse(button.token, message);
    await bot.commandsComResponse(button.id, button.token, message);

  }
}

module.exports = run;