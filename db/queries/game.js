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

async function createGame(title, description, website, developer_id) {
  const { rows } = await pool.query(
    `
      INSERT INTO games (title, description, website, developer_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `,
    [title, description, website, developer_id]
  );

  return rows[0];
}

module.exports = { getAllGames, getGame, getGameGenres, createGame };
