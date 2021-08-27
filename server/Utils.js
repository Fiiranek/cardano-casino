const API_KEY = require("./config/config").API_KEY;

class Utils {
  static verifyApiKey(req) {
    const key =
      req.body.apiKey || req.header("apiKey") || req.headers["API_KEY"];
    if (key === API_KEY) {
      return true;
    } else {
      return false;
    }
  }

  static getPlayersWithChances = (players, totalBet) => {
    return [
      ...(players = players.map((player) => {
        return { ...player, size: player.bet / totalBet };
      })),
    ];
  };

  static sortPlayersBySize = (players) => {
    players = [
      ...players.sort((player1, player2) => player1.size - player2.size),
    ];
    return players;
  };
}
module.exports = Utils;
