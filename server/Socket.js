const { Server } = require("socket.io");
const Database = require("./Database").Database;
const Jackpot = require("./Jackpot").Jackpot;
const log = require("./Logger").log;
const sortPlayersBySize = (players) => {
  players = [
    ...players.sort((player1, player2) => player1.size - player2.size),
  ];
  return players;
};

const getRandomWinnerWithChances = (players) => {
  let random = Math.random();
  // sort players by bet sizes
  players = sortPlayersBySize(players);
  for (let i = 0; i < players.length; i++) {
    if (i === 0) {
      if (random < players[i].size) {
        return players[i];
      }
    } else {
      if (random < players[i].size + players[i - 1].size) return players[i];
    }
  }
};

const getPlayersWithChances = (players, totalBet) => {
  return [
    ...(players = players.map((player) => {
      return { ...player, size: player.bet / totalBet };
    })),
  ];
};

class Socket {
  io;

  constructor(server, dbClient) {
    this.io = new Server(server);
    this.dbClient = dbClient;

    this.jackpot = new Jackpot();

    this.clearJackpot();

    this.io.on("connection", (socket) => {
      this.onPlayerConnect();

      socket.on("place_bet", async (player, cb) => {
        let tryToPlaceBet = await this.placeBetByPlayer(player);
        if (tryToPlaceBet) {
          console.log("BET PLACED");
          if (this.jackpot.state === 0) {
            if (this.canStartCountdown()) {
              console.log("START COUNTDOWN");
              this.changeState(1);

              for (let i = 0; i < this.jackpot.countdownSeconds; i++) {
                setTimeout(() => {
                  this.io.emit("increase_jackpot_countdown", {
                    seconds: this.jackpot.countdownSeconds - i,
                  });
                  if (i === this.jackpot.countdownSeconds - 1) {
                    // START DRAWING

                    if (this.canStartDrawing()) {
                      this.startDrawing();
                    }
                  }
                }, (i + 2) * 1000);
              }
            }
          }
        } else {
        }
      });
    });
  }

  onPlayerConnect() {
    this.io.emit("place_bet", {
      players: this.jackpot.players,
      totalBet: this.jackpot.totalBet,
      state: this.jackpot.state,
    });
    this.io.emit("change_jackpot_state", {
      state: this.jackpot.state,
    });
  }

  changeState(newState) {
    this.jackpot.state = newState;
    this.io.emit("change_jackpot_state", {
      state: this.jackpot.state,
    });
  }

  async placeBetByPlayer(player) {
    let isUserBalanceDecreased = await Database.decreasePlayerBalanceByBet(
      this.dbClient,
      player
    );
    if (isUserBalanceDecreased) {
      this.jackpot.players.push(player);
      this.jackpot.totalBet += player.bet;

      this.jackpot.players = [
        ...getPlayersWithChances(this.jackpot.players, this.jackpot.totalBet),
      ];

      this.io.emit("place_bet", {
        players: this.jackpot.players,
        totalBet: this.jackpot.totalBet,
      });

      console.log(this.jackpot.players);
      console.log(this.jackpot.totalBet);

      // log
      log.info(
        `user_id ${player.receive_address} put bet, bet value ${player.bet}`
      );
      return true;
    }
    return false;
  }

  canStartCountdown() {
    if (this.jackpot.state === 0 && this.jackpot.players.length >= 2) {
      return true;
    }
    return false;
  }

  canStartDrawing() {
    if (this.jackpot.state === 1 && this.jackpot.players.length >= 2) {
      return true;
    }
    return false;
  }

  startDrawing() {
    console.log("START DRAWING");
    this.changeState(2);

    this.jackpot.players = sortPlayersBySize(this.jackpot.players);

    for (let i = 0; i < this.jackpot.drawingRounds; i++) {
      let winnerIndex = Math.floor(Math.random() * this.jackpot.players.length);

      this.jackpot.winnerIndices.push(winnerIndex);
      setTimeout(async () => {
        this.jackpot.players.forEach((player) => {
          delete player.winner;
        });
        this.jackpot.players[this.jackpot.winnerIndices[i]].winner = true;
        let winner = this.jackpot.players[this.jackpot.winnerIndices[i]];
        this.io.emit("draw_jackpot", { players: this.jackpot.players });
        if (i === this.jackpot.drawingRounds - 1) {
          await this.endDrawing(i, winner);
        }
      }, (i + 1) * this.jackpot.drawingRoundDurationInMilliseconds);
    }
  }

  async endDrawing(i, winner) {
    let prize = this.jackpot.calculateWinnerPrize();
    this.changeState(3);

    const isPrizeTransferredToWinner = await Database.transferPrizeToWinnerAccount(
      this.dbClient,
      prize,
      winner
    );
    if (isPrizeTransferredToWinner) {
      log.info(`${prize} prize transferred to ${winner.receive_address}`);
      let winnerData = await Database.getUserData(
        this.dbClient,
        winner.receive_address
      );
      if (winnerData) {
        this.io.emit("update_jackpot_winner_data", winnerData);
      }
      let clearbetsTimeoutInMilliseconds =
        (i + 1) * this.jackpot.drawingRoundDurationInMilliseconds +
        this.jackpot.clearBetsTimeoutInMilliseconds;
      setTimeout(() => {
        this.clearJackpot();
      }, clearbetsTimeoutInMilliseconds);
    } else {
      log.info(`${prize} prize NOT transferred to ${winner.receive_address}`);
    }
  }

  clearJackpot() {
    console.log("CLEAR JACKPOT");
    this.jackpot.players = [];
    this.jackpot.totalBet = 0;
    this.changeState(0);

    this.io.emit("place_bet", {
      players: this.jackpot.players,
      totalBet: this.jackpot.totalBet,
    });
  }
}
module.exports = Socket;
