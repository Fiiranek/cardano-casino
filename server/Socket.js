const { Server } = require("socket.io");
class Socket {
  io;

  constructor(server) {
    this.io = new Server(server);
    this.io.on("connection", (socket) => {
      // console.log(socket);
      console.log("client connected...");

      socket.on("add_player", (player, cb) => {
        console.log(player);
        this.io.emit("add_player", player);
      });
    });
  }
}
module.exports = Socket;
