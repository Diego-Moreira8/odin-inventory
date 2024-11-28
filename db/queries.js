const pool = require("./pool");

async function getAllDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers;");
  return rows;
}

async function getDeveloper(id) {
  const { rows } = await pool.query(
    `
      SELECT name FROM developers
      WHERE id = $1;
    `,
    [id]
  );

  return rows[0];
}

async function createDeveloper(name) {
  await pool.query(
    `
      INSERT INTO developers (name)
      VALUES ($1)
    `,
    [name]
  );
}

module.exports = { getAllDevelopers, getDeveloper, createDeveloper };
