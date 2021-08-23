const http = require("http");
const express = require("express");
const Socket = require("./Socket");
const helmet = require("helmet");
const config = require("./config/config");
const cors = require("cors");
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
    await Database.getUserData(client, req, res);
  });

  app.listen(API_PORT, () => {
    console.log(`Express app listening at http://localhost:${API_PORT}`);
  });

  server.listen(SOCKET_PORT, () => {
    console.log(`Example app listening at http://localhost:${SOCKET_PORT}`);
  });
}

main();
