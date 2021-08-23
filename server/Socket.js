const { Server } = require("socket.io");
const Database = require("./Database").Database;
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

    this.jackpot = {
      players: [],
      winnerIndices: [],
      totalBet: 0,
      state: 0,
      countdownSeconds: 50,
      drawingRounds: 20,
      drawingRoundDurationInMilliseconds: 250,
      clearBetsTimeoutInMilliseconds: 5000,
    };

    // this.players = [];
    // this.totalBet = 0;

    // this.jackpotState = 0;

    // this.countdownSeconds = 8;
    // this.drawingRounds = 20;
    // this.drawingRoundDurationInMilliseconds = 100;

    this.clearJackpot();

    this.io.on("connection", (socket) => {
      // this.io.emit("place_bet", {
      //   players: this.jackpot.players,
      //   totalBet: this.jackpot.totalBet,
      //   state: this.jackpot.state,
      // });
      this.onPlayerConnect();
      socket.on("place_bet", async (player, cb) => {
        let tryToPlaceBet = await this.placeBetByPlayer(player);
        if (tryToPlaceBet) {
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
      log.info(`user_id ${player.user_id} put bet, bet value ${player.bet}`);
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
    // this.io.emit("jackpot_start_drawing");
    this.changeState(2);

    this.jackpot.players = sortPlayersBySize(this.jackpot.players);

    for (let i = 0; i < this.jackpot.drawingRounds; i++) {
      // clear player winners field
      // this.jackpot.players.forEach((player) => {
      //   delete player.winner;
      // });
      // draw winner for each drawing round

      // let winner = getRandomWinnerWithChances(this.jackpot.players);
      // let winnerIndex = this.jackpot.players.findIndex(
      //   (player) => player.receive_address === winner.receive_address
      // );
      // this.jackpot.players[winnerIndex].winner = true;
      let winnerIndex = Math.floor(Math.random() * this.jackpot.players.length);
      // this.jackpot.players[winnerIndex].winner = true;
      this.jackpot.winnerIndices.push(winnerIndex);
      setTimeout(() => {
        this.jackpot.players.forEach((player) => {
          delete player.winner;
        });
        this.jackpot.players[this.jackpot.winnerIndices[i]].winner = true;
        // console.log(playersCopy.filter((p) => p.winner));
        this.io.emit("draw_jackpot", { players: this.jackpot.players });
        if (i === this.jackpot.drawingRounds - 1) {
          this.changeState(4);

          let clearbetsTimeoutInMilliseconds =
            (i + 1) * this.jackpot.drawingRoundDurationInMilliseconds +
            this.jackpot.clearBetsTimeoutInMilliseconds;
          setTimeout(() => {
            this.clearJackpot();
          }, clearbetsTimeoutInMilliseconds);
        }
      }, (i + 1) * this.jackpot.drawingRoundDurationInMilliseconds);
    }

    // clear players and bets
    // setTimeout(
    //   () => this.clearJackpot(),
    //   this.jackpot.clearBetsTimeoutInMilliseconds
    // );
  }

  clearJackpot() {
    console.log("CLEAR JACKPOT");
    console.log(this.jackpot);
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
