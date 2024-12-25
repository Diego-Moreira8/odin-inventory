const pool = require("../pool");

async function getAllDevelopers() {
  const { rows } = await pool.query(
    "SELECT id, name FROM developers ORDER BY UPPER(name);"
  );
  return rows;
}

async function getDeveloper(id) {
  const { rows } = await pool.query(
    `
      SELECT id, name FROM developers
      WHERE id = $1;
    `,
    [id]
  );

  return rows[0];
}

async function createDeveloper(name) {
  const { rows } = await pool.query(
    `
      INSERT INTO developers (name)
      VALUES ($1)
      RETURNING id;
    `,
    [name]
  );

  return rows[0].id;
}

async function updateDeveloper(id, name) {
  await pool.query(
    `
      UPDATE developers 
      SET name = $2 
      WHERE id = $1;
    `,
    [id, name]
  );
}

async function deleteDeveloper(id) {
  await pool.query(
    `
      DELETE FROM products
      USING games
      WHERE products.game_id = games.id
      AND games.developer_id = $1;
    `,
    [id]
  );
  await pool.query("DELETE FROM games WHERE developer_id = $1;", [id]);
  await pool.query("DELETE FROM developers WHERE id = $1;", [id]);
}

async function validateUniqueName(name) {
  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM developers WHERE UPPER(name) = UPPER($1);",
    [name]
  );

  return rows[0].count == 0;
}

module.exports = {
  getAllDevelopers,
  getDeveloper,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  validateUniqueName,
};
