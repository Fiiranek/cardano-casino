export const updateJackpotPlayers = (value) => {
  return {
    type: "UPDATE_JACKPOT_PLAYERS",
    value,
  };
};
export const updateJackpotTotaBet = (value) => {
  return {
    type: "UPDATE_JACKPOT_TOTAL_BET",
    value,
  };
};

export const updateJackpotCountdownState = (value) => {
  return {
    type: "UPDATE_JACKPOT_COUNTDOWN",
    value,
  };
};
export const updateJackpotCountdownSeconds = (value) => {
  return {
    type: "UPDATE_JACKPOT_COUNTDOWN_SECONDS",
    value,
  };
};
export const updateJackpotDrawingState = (value) => {
  return {
    type: "UPDATE_JACKPOT_DRAWING",
    value,
  };
};

export const updateJackpotState = (value) => {
  return {
    type: "UPDATE_JACKPOT_STATE",
    value,
  };
};

// export const markWinnerInPlayers = (value) => {
//   return {
//     type: "UPDATE_JACKPOT_WINNER",
//     value,
//   };
// };
