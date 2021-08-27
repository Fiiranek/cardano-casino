const http = require("http");
const express = require("express");
const Socket = require("./Socket");
const helmet = require("helmet");
const config = require("./config/config");
const cors = require("cors");
const Utils = require("./Utils");
const app = express();
const SOCKET_PORT = 8000;
const API_PORT = 5000;
const Database = require("./Database").Database;
const server = http.createServer(app);

async function main() {
  app.use(express.json());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(cors());
  // if (process.env.ENVIRONMENT === "production") {
  //     app.use(express.static(path.join(__dirname, 'public')))
  // } else {
  //     app.use(express.static(path.join(__dirname, '../client/dist')))
  // }

  const client = await Database.connect(config.DB_CONFIG);

  const sockets = new Socket(server, client);
  app.post("/registerUser", async (req, res) => {
    await Database.registerUser(client, req, res);
  });

  app.get("/users", async (req, res) => {
    let userAddress = req.query.userAddress || req.query.user_address;
    let userData = await Database.getUserData(client, userAddress);

    if (userData) {
      res.status(200).send(userData);
    } else {
      res.status(400).send({ msg: "Could not get user data" });
    }
  });

  app.post("/deposit", async (req, res) => {
    const isApiKeyValid = Utils.verifyApiKey(req);
    if (isApiKeyValid) {
      await Database.deposit(client, req, res);
    } else {
      res.status(400).send({ msg: "Invalid api key" });
    }
  });

  // app.listen(API_PORT, () => {
  //   console.log(`Express app listening at http://localhost:${API_PORT}`);
  // });

  server.listen(SOCKET_PORT, () => {
    console.log(`Socket server listening at http://localhost:${SOCKET_PORT}`);
  });
}

main();
