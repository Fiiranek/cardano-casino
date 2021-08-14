import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants";
export default class ConnectionManager {
  constructor(addPlayer, endRound, clearRound) {
    this.socket = io(SOCKET_URL, { transports: ["websocket"] });
    this.socket.on("connect", () => this.onConnect());
    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    this.socket.on("disconnect", () => this.onDisconnect());

    // this.socket.on("add_player", (player) => addPlayer(player));
    this.socket.on("end_round", (data) => {});
    this.socket.on("clear_round", (data) => {});
  }

  //async onConnect(player) {
  async onConnect() {
    // let data = await this.socket.emit("add_player", player);
    // return data;
    console.log("connected");
  }

  async onDisconnect() {
    console.log("disconnected...");
  }
}
