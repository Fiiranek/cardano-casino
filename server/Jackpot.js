// const Database = require("./Database").Database;
const Database = require("./Database").Database;
class Jackpot {
  constructor() {
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

  // async placeBetByPlayer(dbClient, player) {
  //   let isUserBalanceDecreased = await Database.decreasePlayerBalanceByBet(
  //     dbClient,
  //     player
  //   );
  //   if (isUserBalanceDecreased) {
  //     this.players.push(player);
  //     this.totalBet += player.bet;

  //     this.players = [...getPlayersWithChances(this.players, this.totalBet)];

  //     this.io.emit("place_bet", {
  //       players: this.players,
  //       totalBet: this.totalBet,
  //     });

  //     console.log(this.players);
  //     console.log(this.totalBet);

  //     // log
  //     log.info(
  //       `user_id ${player.receive_address} put bet, bet value ${player.bet}`
  //     );
  //     return true;
  //   }
  //   return false;
  // }

  calculateWinnerPrize() {
    const prize = this.totalBet * (1 - this.commision);
    return prize;
  }

  //   changeState(newState) {
  //     this.state = newState;
  //     this.io.emit("change_jackpot_state", {
  //       state: this.state,
  //     });
  //   }

  //   clear() {
  //     console.log("CLEAR JACKPOT");
  //     this.players = [];
  //     this.totalBet = 0;
  //     this.changeState(0);

  //     this.io.emit("place_bet", {
  //       players: this.players,
  //       totalBet: this.totalBet,
  //     });
  //   }

  //   canStartCountdown() {
  //     if (this.state === 0 && this.players.length >= 2) {
  //       return true;
  //     }
  //     return false;
  //   }

  //   canStartDrawing() {
  //     if (this.state === 1 && this.players.length >= 2) {
  //       return true;
  //     }
  //     return false;
  //   }
}
module.exports = { Jackpot: Jackpot };
