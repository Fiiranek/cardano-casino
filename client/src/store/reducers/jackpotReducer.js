export const jackpotPlayersReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_JACKPOT_PLAYERS":
      return [...action.value];
    default:
      return state;
  }
};

export const jackpotTotalBetReducer = (state = 0, action) => {
  switch (action.type) {
    case "UPDATE_JACKPOT_TOTAL_BET":
      return state + action.value;
    default:
      return state;
  }
};

export const jackpotCountdownStateReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_JACKPOT_COUNTDOWN":
      return action.value;
    default:
      return state;
  }
};
export const jackpotCountdownSecondsReducer = (state = 10, action) => {
  switch (action.type) {
    case "UPDATE_JACKPOT_COUNTDOWN_SECONDS":
      return action.value;
    default:
      return state;
  }
};
export const jackpotDrawingStateReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_JACKPOT_DRAWING":
      return action.value;
    default:
      return state;
  }
};
