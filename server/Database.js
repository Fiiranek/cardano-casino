const pg = require("pg");
const uuid = require("uuid");
class Database {
  static async connect(DB_CONFIG) {
    const client = new pg.Client(DB_CONFIG);
    await client.connect();
    console.log("db connected...");
    return client;
  }

  static async registerUser(client, req, res) {
    // const userId = req.body.userId,
    //   username = req.body.username,
    //   email = req.body.email,
    //   walletAddress = req.body.walletAddress;

    // // ensure that all data is provided
    // if (!userId || !username || !email || !walletAddress) {
    //   res.status(400).send({ msg: "Could not register user" });
    //   return;
    // }
    // const userRegisterQuery = await client.query(
    //   "INSERT INTO casino_users(user_id,username,email,wallet_address,balance,start_balance) VALUES ($1,$2,$3,$4,0,0)",
    //   [userId, username, email, walletAddress]
    // );
    // if (userRegisterQuery.rowCount !== 1) {
    //   res.status(400).send({ msg: "Could not register user" });
    //   return;
    // }
    // res.status(200).send({ msg: "Success" });
    // return;

    const username = req.body.username,
      receiveAddress = req.body.receiveAddress,
      sendAddress = req.body.sendAddress,
      userId = uuid.v4();

    // ensure that all data is provided
    if (!username || !receiveAddress || !sendAddress) {
      res.status(400).send({ msg: "Could not register user" });
      return;
    }
    const userRegisterQuery = await client.query(
      "INSERT INTO casino_users(user_id,username,receive_address,send_address,balance,start_balance) VALUES ($1,$2,$3,$4,0,0)",
      [userId, username, receiveAddress, sendAddress]
    );
    if (userRegisterQuery.rowCount !== 1) {
      res.status(400).send({ msg: "Could not register user" });
      return;
    }
    res.status(200).send({ msg: "Success" });
    return;
  }

  static async getUserData(client, req, res) {
    //const searchedUserId = req.query.userId;
    const searchedUserReceiveAddress = req.query.userReceiveAddress;
    if (!searchedUserReceiveAddress) {
      res.status(400).send({ msg: "Could not get user data" });
      return;
    }
    const queryResult = await client.query(
      "SELECT * FROM casino_users WHERE receive_address=$1",
      [searchedUserReceiveAddress]
    );
    if (queryResult.rows.length > 0) {
      res.status(200).send(queryResult.rows[0]);
      return;
    }
    res.status(400).send({ msg: "Could not get user data" });
    return;
  }

  static async decreasePlayerBalanceByBet(client, user) {
    const queryResult = await client.query(
      "SELECT balance FROM casino_users WHERE user_id=$1",
      [user.user_id]
    );
    if (queryResult.rows.length > 0) {
      let userBalance = queryResult.rows[0].balance;
      let canPlaceBet = user.bet <= userBalance;
      if (canPlaceBet) {
        const newBalance = userBalance - user.bet;
        const queryResult = await client.query(
          "UPDATE casino_users SET balance=$1 WHERE user_id=$2",
          [newBalance, user.user_id]
        );
      }
      if (queryResult.rowCount === 1) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
module.exports = {
  Database: Database,
};
