const Utils = require("./Utils");

const initialJackpotData = {
  players: [],
  totalBet: 0,
  state: 0,
};
const Database = require("./Database").Database;
class Jackpot {
  constructor(io, dbClient) {
    this.io = io;
    this.dbClient = dbClient;
    this.players = [];
    this.winnerIndices = [];
    this.totalBet = 0;
    this.state = 0;
    this.countdownSeconds = 4;
    this.drawingRounds = 20;
    this.drawingRoundDurationInMilliseconds = 250;
    this.clearBetsTimeoutInMilliseconds = 5000;
    this.commision = 0.05;
  }

  // async placeBet(player) {
  //   let decreasePlayerBalance = await Database.decreasePlayerBalanceByBet(
  //     this.dbClient,
  //     player
  //   );

  //   if (decreasePlayerBalance) {
  //     let jackpotData = await this.getData();
  //     if (jackpotData) {
  //       jackpotData.players.push(player);
  //       jackpotData.totalBet += bet;
  //       jackpotData.players = [
  //         ...Utils.getPlayersWithChances(jackpotData.players),
  //       ];

  //       // UPDATE JACKPOT
  //       const updateResult = await this.updateData(jackpotData);
  //       if (updateResult) {
  //         console.log("BET PLACED");
  //         console.log(jackpotData);
  //         this.io.emit("place_bet", { ...jackpotData });

  //         return jackpotData;
  //       }
  //       return false;
  //     }
  //     return false;
  //   }
  //   return false;
  // }

  // async getData() {
  //   // RETURNS PARSED DATA
  //   const queryResult = await this.dbClient.query("SELECT * FROM jackpot");
  //   if (queryResult.rows.length > 0) {
  //     console.log(queryResult.rows[0].data);
  //     return JSON.parse(queryResult.rows[0].data);
  //   }
  //   return false;
  // }

  // async updateData(newJackpotData) {
  //   // newData MUST BE PARSED
  //   newJackpotData = JSON.stringify(newData);
  //   const updateResult = await dbClient.query("UPDATE jackpot SET data=$1", [
  //     newJackpotData,
  //   ]);
  //   if (updateResult.rowCount === 1) {
  //     return JSON.parse(newJackpotData);
  //   } else {
  //     return false;
  //   }
  // }

  // async canStartCountdown() {
  //   let jackpotData = await this.getData();
  //   if (jackpotData) {
  //     if (jackpotData.state === 0 && jackpotData.state.players.length >= 2) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   return false;
  // }

  // async canStartDrawing() {
  //   let jackpotData = await this.getData();
  //   if (jackpotData) {
  //     if (jackpotData.state === 1 && jackpotData.players.length >= 2) {
  //       return true;
  //     }
  //     return false;
  //   }

  //   return false;
  // }

  calculateWinnerPrize() {
    const prize = this.totalBet * (1 - this.commision);
    return prize;
  }

  // async changeState(newState) {
  //   let jackpotData = await this.getData();
  //   if (jackpotData) {
  //     jackpotData.state = newState;
  //   }
  //   this.state = newState;

  //   let updateJackpotData = await this.updateData(jackpotData);
  //   if (updateJackpotData) {
  //     this.io.emit("change_jackpot_state", {
  //       state: newState,
  //     });

  //     if (newState === 0) {
  //       console.log("JACKPOT RENEW");
  //     } else if (newState === 1) {
  //       console.log("START COUNTDOWN");
  //     } else if (newState === 2) {
  //       console.log("START DRAWING");
  //     }
  //     return true;
  //   }
  //   return false;
  // }

  // async startDrawing() {
  //   let changeState = await this.changeState(2, this.io);
  //   if (!changeState) {
  //     return false;
  //   }
  //   let jackpotData = await this.getData();
  //   if (!jackpotData) {
  //     return false;
  //   }
  //   jackpotData.players = Utils.sortPlayersBySize(jackpotData.players);
  //   let winnersIndices = [];
  //   for (let i = 0; i < this.drawingRounds; i++) {
  //     let winnerIndex = Math.floor(Math.random() * jackpotData.players.length);

  //     winnerIndices.push(winnerIndex);

  //     setTimeout(async () => {
  //       jackpotData.players.forEach((player) => {
  //         delete player.winner;
  //       });
  //       jackpotData.players[winnerIndices[i]].winner = true;
  //       let winner = jackpotData.players[winnerIndices[i]];
  //       this.io.emit("draw_jackpot", { players: jackpotData.players });
  //       if (i === jackpot.drawingRounds - 1) {
  //         await this.endDrawing(i, winner);
  //       }
  //     }, (i + 1) * jackpot.drawingRoundDurationInMilliseconds);
  //   }
  // }

  // async endDrawing(i, winner) {
  //   let prize = this.calculateWinnerPrize();
  //   let changeState = await this.changeState(3);
  //   if (!changeState) {
  //     return false;
  //   }
  //   const isPrizeTransferredToWinner = await Database.transferPrizeToWinnerAccount(
  //     this.dbClient,
  //     prize,
  //     winner
  //   );
  //   if (isPrizeTransferredToWinner) {
  //     let winnerData = await Database.getUserData(
  //       this.dbClient,
  //       winner.address
  //     );
  //     if (winnerData) {
  //       this.io.emit("update_jackpot_winner_data", winnerData);
  //     }
  //     let clearbetsTimeoutInMilliseconds =
  //       (i + 1) * jackpot.drawingRoundDurationInMilliseconds +
  //       jackpot.clearBetsTimeoutInMilliseconds;
  //     setTimeout(async () => {
  //       await this.clear();
  //     }, clearbetsTimeoutInMilliseconds);
  //   } else {
  //   }
  // }

  // async clear() {
  //   console.log("CLEAR JACKPOT");

  //   let updateJackpotResult = await this.updateData(initialJackpotData);

  //   if (!updateJackpotResult) {
  //     return false;
  //   }
  //   this.io.emit("change_jackpot_state", { ...initialJackpotData });

  //   this.io.emit("place_bet", { ...initialJackpotData });
  // }

  async placeBet(player) {
    let isUserBalanceDecreased = await Database.decreasePlayerBalanceByBet(
      this.dbClient,
      player
    );
    if (isUserBalanceDecreased) {
      this.players.push(player);
      this.totalBet += player.bet;

      this.players = [
        ...Utils.getPlayersWithChances(this.players, this.totalBet),
      ];

      this.io.emit("place_bet", {
        players: this.players,
        totalBet: this.totalBet,
      });

      console.log(this.players);
      console.log(this.totalBet);

      // log
      log.info(
        `user_id ${player.receive_address} put bet, bet value ${player.bet}`
      );
      return true;
    }
    return false;
  }

  canStartCountdown() {
    if (this.state === 0 && this.players.length >= 2) {
      return true;
    }
    return false;
  }

  canStartDrawing() {
    if (this.state === 1 && this.players.length >= 2) {
      return true;
    }
    return false;
  }
}
module.exports = { Jackpot: Jackpot };
