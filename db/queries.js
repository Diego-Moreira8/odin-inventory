const pool = require("./pool");

async function getAllDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers;");
  return rows;
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

module.exports = { createDeveloper, getAllDevelopers };
