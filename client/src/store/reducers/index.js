import {
  jackpotPlayersReducer,
  jackpotTotalBetReducer,
  jackpotCountdownStateReducer,
  jackpotCountdownSecondsReducer,
  jackpotDrawingStateReducer,
} from "./jackpotReducer";

import { combineReducers } from "redux";

export const allReducers = combineReducers({
  jackpotPlayers: jackpotPlayersReducer,
  jackpotTotalBet: jackpotTotalBetReducer,
  jackpotCountdownState: jackpotCountdownStateReducer,
  jackpotCountdownSeconds: jackpotCountdownSecondsReducer,
  jackpotDrawingState: jackpotDrawingStateReducer,
});
