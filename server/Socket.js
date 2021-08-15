const { Server } = require("socket.io");

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

  constructor(server) {
    this.io = new Server(server);
    this.players = [];
    this.totalBet = 0;
    this.isCountdown = false;
    this.isDrawing = false;

    this.countdownSeconds = 3;
    this.drawingRounds = 20;
    this.drawingRoundDurationInMilliseconds = 100;

    this.io.on("connection", (socket) => {
      this.io.emit("place_bet", {
        players: this.players,
        totalBet: this.totalBet,
      });

      socket.on("place_bet", (player, cb) => {
        this.players.push(player);
        this.totalBet += player.bet;

        this.players = [...getPlayersWithChances(this.players, this.totalBet)];

        this.io.emit("place_bet", {
          players: this.players,
          totalBet: this.totalBet,
        });
        if (!this.isCountdown && !this.isDrawing) {
          if (this.players.length >= 2) {
            console.log("start countdown");
            // start countdown
            this.io.emit("jackpot_start_countdown");
            this.isCountdown = true;

            for (let i = 0; i < this.countdownSeconds; i++) {
              setTimeout(() => {
                this.io.emit("jackpot_countdown_seconds_increase", {
                  seconds: this.countdownSeconds - i,
                });
                if (i === this.countdownSeconds - 1) {
                  // START DRAWING
                  this.io.emit("jackpot_end_countdown");
                  this.isCountdown = false;

                  // start drawing
                  if (!this.isDrawing) {
                    this.startDrawing();
                  }
                }
              }, (i + 3) * 1000);
            }
          }
        }
      });
    });
  }

  startDrawing() {
    console.log("start drawing");
    this.io.emit("jackpot_start_drawing");
    this.isDrawing = true;
    this.players = sortPlayersBySize(this.players);

    for (let i = 0; i < this.drawingRounds; i++) {
      // clear player winners field
      this.players.forEach((player) => {
        delete player.winner;
      });
      // draw winner for each drawing round
      console.log("drawing...");
      let winner = getRandomWinnerWithChances(this.players);
      let winnerIndex = this.players.findIndex(
        (player) => player.userId === winner.userId
      );
      this.players[winnerIndex].winner = true;

      setTimeout(() => {
        // console.log(playersCopy.filter((p) => p.winner));
        this.io.emit("jackpot_draw", { players: this.players });
      }, (i + 1) * this.drawingRoundDurationInMilliseconds);
    }
  }
}
module.exports = Socket;
