const { Server } = require("socket.io");

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
    this.io.on("connection", (socket) => {
      socket.on("place_bet", (player, cb) => {
        this.players.push(player);
        this.totalBet += player.bet;

        this.players = [...getPlayersWithChances(this.players, this.totalBet)];

        this.io.emit("place_bet", {
          players: this.players,
          totalBet: this.totalBet,
        });
      });
    });
  }
}
module.exports = Socket;
