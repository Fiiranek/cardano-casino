// const Database = require("./Database").Database;
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

  calculateWinnerPrize() {
    const prize = this.totalBet * (1 - this.commision);
    return prize;
  }

  //   async placeBetByPlayer(player) {
  //     let isUserBalanceDecreased = await Database.decreasePlayerBalanceByBet(
  //       this.dbClient,
  //       player
  //     );
  //     if (isUserBalanceDecreased) {
  //       this.jackpot.players.push(player);
  //       this.jackpot.totalBet += player.bet;

  //       this.jackpot.players = [
  //         ...getPlayersWithChances(this.jackpot.players, this.jackpot.totalBet),
  //       ];

  //       this.io.emit("place_bet", {
  //         players: this.jackpot.players,
  //         totalBet: this.jackpot.totalBet,
  //       });

  //       console.log(this.jackpot.players);
  //       console.log(this.jackpot.totalBet);

  //       // log
  //       log.info(`user_id ${player.user_id} put bet, bet value ${player.bet}`);
  //       return true;
  //     }
  //     return false;
  //   }

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
