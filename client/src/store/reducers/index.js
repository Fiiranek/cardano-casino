import {
  jackpotPlayersReducer,
  jackpotTotalBetReducer,
  jackpotCountdownStateReducer,
  jackpotCountdownSecondsReducer,
  jackpotDrawingStateReducer,
  jackpotStateReducer,
} from "./jackpotReducer";

import { combineReducers } from "redux";

export const allReducers = combineReducers({
  jackpotPlayers: jackpotPlayersReducer,
  jackpotTotalBet: jackpotTotalBetReducer,
  // jackpotCountdownState: jackpotCountdownStateReducer,
  jackpotCountdownSeconds: jackpotCountdownSecondsReducer,
  // jackpotDrawingState: jackpotDrawingStateReducer,

  jackpotState: jackpotStateReducer,
});
