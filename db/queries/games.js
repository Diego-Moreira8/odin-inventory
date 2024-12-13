const pool = require("../pool");

async function getAllGames() {
  const { rows } = await pool.query(
    "SELECT * FROM games ORDER BY UPPER(title);"
  );
  return rows;
}

async function getGamesFromDeveloper(developer_id) {
  const { rows } = await pool.query(
    `
      SELECT id, title FROM games
      WHERE developer_id = $1;
    `,
    [developer_id]
  );

  return rows;
}

async function getGamesWithGenre(genre_id) {
  const { rows } = await pool.query(
    `
      SELECT id, title 
      FROM games
      JOIN games_genres
      ON games_genres.game_id = games.id
      WHERE games_genres.genre_id = $1;
    `,
    [genre_id]
  );

  return rows;
}

async function getGame(id) {
  const { rows } = await pool.query(
    `
      SELECT games.*, developers.name AS developer_name
      FROM games
      JOIN developers ON games.developer_id = developers.id
      WHERE games.id = $1;
    `,
    [id]
  );
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

  return rows[0].id;
}

async function createGameGenreRelation(game_id, genre_ids) {
  if (genre_ids.length < 1) return;

  const valuesForQuery = genre_ids.reduce(
    (a, c, i, arr) => a + `($1, $${i + 2})` + (i < arr.length - 1 ? "," : ";"),
    ""
  ); // [10,20,30] => '($1, $2),($1, $3),($1, $4);'

  await pool.query(
    "INSERT INTO games_genres (game_id, genre_id) VALUES " + valuesForQuery,
    [game_id, ...genre_ids]
  );
}

async function deleteGameGenreRelation(game_id) {
  await pool.query("DELETE FROM games_genres WHERE game_id = $1;", [game_id]);
}

async function updateGame(id, title, description, website, developer_id) {
  await pool.query(
    `
      UPDATE games
      SET title = $2, description = $3, website = $4, developer_id = $5
      WHERE id = $1;
    `,
    [id, title, description, website, developer_id]
  );
}

async function deleteGame(id) {
  await pool.query("DELETE FROM games WHERE id = $1;", [id]);
}

module.exports = {
  getAllGames,
  getGamesFromDeveloper,
  getGamesWithGenre,
  getGame,
  getGameGenres,
  createGame,
  createGameGenreRelation,
  deleteGameGenreRelation,
  updateGame,
  deleteGame,
};
