class User {
  constructor(
    address,
    balance,
    join_date,
    jackpot_games_number,
    jackpot_wins_number
  ) {
    this.address = address;
    this.balance = balance;
    this.join_date = join_date;
    this.jackpot_games_number = jackpot_games_number;
    this.jackpot_wins_number = jackpot_wins_number;
  }

  toJson() {
    return {
      address: this.address,
      balance: this.balance,
      join_date: this.join_date,
      jackpot_games_number: this.jackpot_games_number,
      jackpot_wins_number: this.jackpot_wins_number,
    };
  }
}

module.exports = User;
