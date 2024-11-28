const pool = require("./pool");

async function createDeveloper(name) {
  await pool.query(
    `
      INSERT INTO developers (name)
      VALUES ($1)
    `,
    [name]
  );
}

module.exports = { createDeveloper };
