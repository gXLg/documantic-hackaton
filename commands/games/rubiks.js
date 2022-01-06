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
      ]
    }
  ];

  message.embeds[0].description = gett();
  message.components = comp;

  const result = await bot.commandsEditResponse(data.token, message);
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

    await bot.commandsDeferredWithCom(button.id, button.token);
    const name = button.data.custom_id;

    if(name == "turn_front"){
      front();
    }

    message.embeds[0].description = gett();
    await bot.commandsEditResponse(button.token, message);

  }
}

module.exports = run;