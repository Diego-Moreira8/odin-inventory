const pool = require("../pool");

async function getAllPlatforms() {
  const { rows } = await pool.query(
    "SELECT id, name FROM platforms ORDER BY UPPER(name);"
  );
  return rows;
}

async function getPlatform(id) {
  const { rows } = await pool.query(
    `
      SELECT id, name FROM platforms
      WHERE id = $1;
    `,
    [id]
  );

  return rows[0];
}

async function createPlatform(name) {
  const { rows } = await pool.query(
    `
      INSERT INTO platforms (name)
      VALUES ($1)
      RETURNING id;
    `,
    [name]
  );

  return rows[0].id;
}

async function updatePlatform(id, name) {
  await pool.query(
    `
      UPDATE platforms 
      SET name = $2 
      WHERE id = $1;
    `,
    [id, name]
  );
}

async function deletePlatform(id) {
  await pool.query("DELETE FROM products WHERE platform_id = $1;", [id]);
  await pool.query("DELETE FROM platforms WHERE id = $1;", [id]);
}

module.exports = {
  getAllPlatforms,
  getPlatform,
  createPlatform,
  updatePlatform,
  deletePlatform,
};
