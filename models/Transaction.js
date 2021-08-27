class Transaction {
  constructor(address, amount, type) {
    this.address = address;
    this.type = type;
    this.amount = amount;
    this.date = new Date().toISOString();
  }
}

module.exports = Transaction;
