const DB_CONFIG = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: 5432,
};
const API_KEY = process.env.API_KEY;
module.exports = {
  DB_CONFIG,
  API_KEY,
};
