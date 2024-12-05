const pool = require("../pool");

async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM games;");
  return rows;
}

module.exports = { getAllGames };
