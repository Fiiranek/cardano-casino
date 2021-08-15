import {
  jackpotPlayersReducer,
  jackpotTotalBetReducer,
} from "./jackpotReducer";

import { combineReducers } from "redux";

export const allReducers = combineReducers({
  jackpotPlayers: jackpotPlayersReducer,
  jackpotTotalBet: jackpotTotalBetReducer,
});
