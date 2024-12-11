const pool = require("../pool");

async function getAllProducts() {
  const { rows } = await pool.query(
    `
      SELECT
        products.id,
        games.title AS game_title,
        platforms.name AS platform_name
      FROM products
      JOIN games ON products.game_id = games.id
      JOIN platforms ON products.platform_id = platforms.id
      ORDER BY game_title, platform_name;
    `
  );

  return rows;
}

module.exports = { getAllProducts };
