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
