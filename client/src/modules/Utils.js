export default class Utils {
  static getRandomArrElement = (arr) => {
    let randomIndex = Math.floor(Math.random() * arr.length);
    console.log(arr[randomIndex]);
    return arr[randomIndex];
  };

  static getRandomWinnerWithChances = (players) => {
    let random = Math.random();
    players = [
      ...players.sort((player1, player2) => player1.size - player2.size),
    ];
    for (let i = 0; i < players.length; i++) {
      if (i === 0) {
        if (random < players[i].size) return players[i];
      } else {
        if (random < players[i].size + players[i - 1].size) return players[i];
      }
    }
  };
}
