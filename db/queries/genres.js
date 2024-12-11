const pool = require("../pool");

async function getAllGenres() {
  const { rows } = await pool.query(
    "SELECT id, name FROM genres ORDER BY UPPER(name);"
  );
  return rows;
}

async function getGenre(id) {
  const { rows } = await pool.query(
    `
      SELECT id, name FROM genres
      WHERE id = $1;
    `,
    [id]
  );

  return rows[0];
}

async function createGenre(name) {
  const { rows } = await pool.query(
    `
      INSERT INTO genres (name)
      VALUES ($1)
      RETURNING id;
    `,
    [name]
  );

  return rows[0];
}

async function updateGenre(id, name) {
  await pool.query(
    `
      UPDATE genres 
      SET name = $2 
      WHERE id = $1;
    `,
    [id, name]
  );
}

async function deleteGenre(id) {
  await pool.query("DELETE FROM genres WHERE id = $1;", [id]);
}

module.exports = {
  getAllGenres,
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};
