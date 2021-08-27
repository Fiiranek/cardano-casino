class Transaction {
  constructor(user_address, amount, type) {
    this.user_address = user_address;
    this.type = type;
    this.amount = amount;
    this.date = new Date();
  }
}

module.exports = Transaction;
