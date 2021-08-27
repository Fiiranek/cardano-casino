const Transaction = require("./modules/Transaction");
const pg = require("pg");
const uuid = require("uuid");
const CARDANO_NODE_IP = "75.119.156.5";
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

    const // username = req.body.username,
      receiveAddress = req.body.receiveAddress,
      sendAddress = req.body.sendAddress;

    // ensure that all data is provided
    //if (!username || !receiveAddress || !sendAddress) {
    if (!receiveAddress || !sendAddress) {
      res.status(400).send({ msg: "Could not register user" });
      return;
    }
    // const userRegisterQuery = await client.query(
    //   "INSERT INTO casino_users(user_id,username,receive_address,send_address,balance,start_balance) VALUES ($1,$2,$3,$4,0,0)",
    //   [userId, username, receiveAddress, sendAddress]
    // );

    // check if account already exists
    const queryResult = await client.query(
      "SELECT * FROM casino_users WHERE receive_address=$1",
      [receiveAddress]
    );

    if (queryResult.rows.length > 0) {
      console.log(queryResult.rows[0]);
      res.status(200).send(queryResult.rows[0]);
      return;
    }

    const userRegisterQuery = await client.query(
      "INSERT INTO casino_users(receive_address,send_address,balance,start_balance) VALUES ($1,$2,1000,0)",
      [receiveAddress, sendAddress]
    );
    if (userRegisterQuery.rowCount !== 1) {
      res.status(400).send({ msg: "Could not register user" });
      return;
    }

    res.status(200).send({
      receive_address: receiveAddress,
      send_address: sendAddress,
      balance: 0,
      start_balance: 0,
    });
    return;
  }

  // static async getUserData(client, req, res) {
  static async getUserData(client, searchedUserReceiveAddress) {
    //const searchedUserId = req.query.userId;
    // const searchedUserReceiveAddress = req.query.userReceiveAddress;
    if (!searchedUserReceiveAddress) {
      //res.status(400).send({ msg: "Could not get user data" });
      return false;
    }
    const queryResult = await client.query(
      "SELECT * FROM casino_users WHERE receive_address=$1",
      [searchedUserReceiveAddress]
    );
    if (queryResult.rows.length > 0) {
      //res.status(200).send(queryResult.rows[0]);
      return queryResult.rows[0];
    }
    //res.status(400).send({ msg: "Could not get user data" });
    return false;
  }

  static async decreasePlayerBalanceByBet(client, user) {
    const queryResult = await client.query(
      "SELECT balance FROM casino_users WHERE receive_address=$1",
      [user.receive_address]
    );
    if (queryResult.rows.length > 0) {
      let userBalance = queryResult.rows[0].balance;
      let canPlaceBet = user.bet <= userBalance;
      if (canPlaceBet) {
        const newBalance = userBalance - user.bet;
        const queryResult = await client.query(
          "UPDATE casino_users SET balance=$1 WHERE receive_address=$2",
          [newBalance, user.receive_address]
        );
        if (queryResult.rowCount === 1) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  static async transferPrizeToWinnerAccount(client, prize, user) {
    //static transferPrizeToWinnerAccount(client, prize, winner) {
    const queryResult = await client.query(
      "SELECT balance FROM casino_users WHERE receive_address=$1",
      [user.receive_address]
    );
    if (queryResult.rows.length > 0) {
      let userBalance = queryResult.rows[0].balance;
      userBalance += prize;
      const result = await client.query(
        "UPDATE casino_users SET balance=$1 WHERE receive_address=$2",
        [userBalance, user.receive_address]
      );

      if (result.rowCount === 1) {
        return true;
      } else {
        return false;
      }
    }
    return false;
    // client
    //   .query("SELECT balance FROM casino_users WHERE receive_address=$1", [
    //     winner.receive_address,
    //   ])
    //   .then((queryResult) => {
    //     if (queryResult.rows.length > 0) {
    //       let userBalance = queryResult.rows[0].balance;
    //       userBalance += prize;
    //       client
    //         .query(
    //           "UPDATE casino_users SET balance=$1 WHERE receive_address=$2",
    //           [userBalance, winner.receive_address]
    //         )
    //         .then((result) => {
    //           if (result.rowCount === 1) {
    //             console.log("WINNER RECEIVED PRIZE!");
    //             return true;
    //           } else {
    //             return false;
    //           }
    //         });
    //     }
    //     return false;
    //   });
  }

  static async deposit(client, req, res) {
    const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;

    if (ip != CARDANO_NODE_IP) {
      res.status(400).send({ msg: "Wrong host" });
      return;
    }

    if (!depositAddress || !depositAmount) {
      res.status(400).send({ msg: "Could not deposit" });
      return;
    }

    let depositAddress = req.body.address || req.body.deposit_address,
      depositAmount = req.body.amount || req.body.deposit_amount;
    console.log(depositAddress, depositAmount);
    if (!depositAddress || !depositAmount) {
      res.status(400).send({ msg: "Could not deposit" });
      return;
    }

    const queryResult = await client.query(
      "SELECT balance FROM casino_users WHERE receive_address=$1",
      [depositAddress]
    );

    if (queryResult.rows.length > 0) {
      const userBalance = queryResult.rows[0].balance;
      const newBalance = userBalance + depositAmount;
      const result = await client.query(
        "UPDATE casino_users SET balance=$1 WHERE receive_address=$2",
        [newBalance, depositAddress]
      );

      if (result.rowCount === 1) {
        // ADD DEPOSIT TRANSACTION TO TRANSACTIONS LIST
        await Database.addTransactionToUserTransactionsList(
          depositAddress,
          depositAmount,
          "DEPOSIT"
        );

        res.status(200).send({ msg: "Deposit success" });
        return;
      } else {
        res.status(400).send({ msg: "Could not deposit" });
        return;
      }
    }
    res.status(400).send({ msg: "Could not deposit" });
    return;
  }

  static async addTransactionToUserTransactionsList(address, amount, type) {
    const transaction = new Transaction(address, amount, type);
    const addTransactionQuery = await client.query(
      "INSERT INTO casino_transactions(address,amount,type,date) VALUES ($1,$2,$3,$4)",
      [
        transaction.address,
        transaction.amount,
        transaction.type,
        transaction.date,
      ]
    );
    if (addTransactionQuery.rowCount !== 1) {
      return false;
    } else {
      return true;
    }
  }
}
module.exports = {
  Database: Database,
};
