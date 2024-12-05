const pool = require("../pool");

async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM games;");
  return rows;
}

async function getGame(id) {
  const { rows } = await pool.query("SELECT * FROM games WHERE id = $1;", [id]);
  return rows[0];
}

async function getGameGenres(id) {
  const { rows } = await pool.query(
    `
      SELECT ge.id, ge.name
      FROM genres AS ge
      JOIN games_genres AS gg 
      ON ge.id = gg.genre_id
      WHERE game_id = $1;
    `,
    [id]
  );

  return rows;
}

module.exports = { getAllGames, getGame, getGameGenres };
