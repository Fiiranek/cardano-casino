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

    const // username = req.body.username,
      receiveAddress = req.body.receiveAddress,
      sendAddress = req.body.sendAddress,
      userId = uuid.v4();

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
      res.status(200).send({ msg: "Account already exists" });
      return;
    }

    const userRegisterQuery = await client.query(
      "INSERT INTO casino_users(receive_address,send_address,balance,start_balance) VALUES ($1,$2,0,0)",
      [receiveAddress, sendAddress]
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
    console.log(queryResult.rows[0].balance);
    if (queryResult.rows.length > 0) {
      const userBalance = queryResult.rows[0].balance;
      const newBalance = userBalance + depositAmount;
      const result = await client.query(
        "UPDATE casino_users SET balance=$1 WHERE receive_address=$2",
        [newBalance, depositAddress]
      );
      console.log(newBalance);
      if (result.rowCount === 1) {
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
}
module.exports = {
  Database: Database,
};
