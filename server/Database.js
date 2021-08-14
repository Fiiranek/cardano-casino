const pg = require("pg");
class Database {
  static async connect(DB_CONFIG) {
    const client = new pg.Client(DB_CONFIG);
    await client.connect();
    console.log("db connected...");
    return client;
  }

  static async registerUser(client, req, res) {
    const userId = req.body.userId,
      username = req.body.username,
      email = req.body.email,
      walletAddress = req.body.walletAddress;

    // ensure that all data is provided
    if (!userId || !username || !email || !walletAddress) {
      res.status(400).send({ msg: "Could not register user" });
      return;
    }
    const userRegisterQuery = await client.query(
      "INSERT INTO users(user_id,username,email,wallet_address,balance) VALUES ($1,$2,$3,$4,0)",
      [userId, username, email, walletAddress]
    );
    if (userRegisterQuery.rowCount !== 1) {
      res.status(400).send({ msg: "Could not register user" });
      return;
    }
    res.status(200).send({ msg: "Success" });
    return;
  }

  static async getUserData(client, req, res) {
    const searchedUserId = req.query.userId;
    if (!searchedUserId) {
      res.status(400).send({ msg: "Could not get user data" });
      return;
    }
    const queryResult = await client.query(
      "SELECT * FROM users WHERE user_id=$1",
      [searchedUserId]
    );
    if (queryResult.rows.length > 0) {
      res.status(200).send(queryResult.rows[0]);
      return;
    }
    res.status(400).send({ msg: "Could not get user data" });
    return;
  }
}
module.exports = {
  Database: Database,
};
