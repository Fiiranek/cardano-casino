const Transaction = require("../models/Transaction");
const User = require("../models/User");
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

    const address = req.body.address;

    // ensure that all data is provided
    if (!address) {
      res
        .status(400)
        .send({ msg: "Could not register user, no address found" });
      return;
    }

    let newUser = new User(address, 0, new Date().toISOString(), 0, 0);

    // check if account already exists
    const queryResult = await client.query(
      "SELECT * FROM casino_users WHERE address=$1",
      [address]
    );

    if (queryResult.rows.length > 0) {
      console.log(queryResult.rows[0]);
      res.status(200).send(queryResult.rows[0]);
      return;
    }
    console.log([
      newUser.address,
      newUser.balance,
      newUser.join_date,
      newUser.jackpot_games_number,
      newUser.jackpot_wins_number,
    ]);
    const userRegisterQuery = await client.query(
      "INSERT INTO casino_users(address,balance,join_date,jackpot_games_number,jackpot_wins_number) VALUES ($1,$2,$3,$4,$5)",
      [
        newUser.address,
        newUser.balance,
        newUser.join_date,
        newUser.jackpot_games_number,
        newUser.jackpot_wins_number,
      ]
    );
    if (userRegisterQuery.rowCount !== 1) {
      res.status(400).send({ msg: "Could not register user" });
      return;
    }

    res.status(200).send(newUser.toJson());
    return;
  }

  static async getUserData(client, searchedUserAddress) {
    if (!searchedUserAddress) {
      return false;
    }
    const queryResult = await client.query(
      "SELECT * FROM casino_users WHERE address=$1",
      [searchedUserAddress]
    );
    if (queryResult.rows.length > 0) {
      return queryResult.rows[0];
    }
    return false;
  }

  static async decreasePlayerBalanceByBet(client, user) {
    const queryResult = await client.query(
      "SELECT balance FROM casino_users WHERE address=$1",
      [user.address]
    );

    if (queryResult.rows.length > 0) {
      let userBalance = queryResult.rows[0].balance;
      let canPlaceBet = user.bet <= userBalance;
      if (canPlaceBet) {
        const newBalance = userBalance - user.bet;
        const queryResult = await client.query(
          "UPDATE casino_users SET balance=$1 WHERE address=$2",
          [newBalance, user.address]
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
    const queryResult = await client.query(
      "SELECT balance FROM casino_users WHERE address=$1",
      [user.address]
    );

    if (queryResult.rows.length > 0) {
      let userBalance = queryResult.rows[0].balance;
      userBalance += prize;
      const result = await client.query(
        "UPDATE casino_users SET balance=$1 WHERE address=$2",
        [userBalance, user.address]
      );

      if (result.rowCount === 1) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  static async deposit(client, req, res) {
    const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
    console.log(ip);
    // if (ip != CARDANO_NODE_IP) {
    //   res.status(400).send({ msg: "Wrong host" });
    //   return;
    // }
    let depositAddress = req.body.address || req.body.deposit_address,
      depositAmount = req.body.amount || req.body.deposit_amount;
    console.log(depositAddress, depositAmount);

    if (!depositAddress || !depositAmount) {
      res.status(400).send({ msg: "Not enough deposit data" });
      return;
    }

    const queryResult = await client.query(
      "SELECT * FROM casino_users WHERE address=$1",
      [depositAddress]
    );

    if (queryResult.rows.length > 0) {
      const userBalance = queryResult.rows[0].balance;
      const newBalance = userBalance + depositAmount;
      const result = await client.query(
        "UPDATE casino_users SET balance=$1 WHERE address=$2",
        [newBalance, depositAddress]
      );

      if (result.rowCount === 1) {
        // ADD DEPOSIT TRANSACTION TO TRANSACTIONS LIST
        await Database.addTransactionToUserTransactionsList(
          client,
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
    } else {
      res.status(400).send({ msg: "Cant deposit" });
      return;
    }
  }

  static async addTransactionToUserTransactionsList(
    client,
    address,
    amount,
    type
  ) {
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
