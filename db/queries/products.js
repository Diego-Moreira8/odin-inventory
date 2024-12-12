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

async function getProduct(id) {
  const { rows } = await pool.query(
    `
    SELECT 
      products.id,
      products.launch_date,
      products.price,
      games.title AS game_title,
      games.id AS game_id,
      platforms.name AS platform_name,
      platforms.id AS platform_id
    FROM products
    JOIN games ON products.game_id = games.id
    JOIN platforms ON products.platform_id = platforms.id
    WHERE products.id = $1;
    `,
    [id]
  );

  return rows[0];
}

async function createProduct(game_id, platform_id, launch_date, price) {
  const { rows } = await pool.query(
    `
      INSERT INTO products (game_id, platform_id, launch_date, price)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `,
    [game_id, platform_id, launch_date, price]
  );

  return rows[0];
}

async function isProductUnique(game_id, platform_id) {
  const { rows } = await pool.query(
    `
      SELECT * FROM products
      WHERE game_id = $1 AND platform_id = $2;
    `,
    [game_id, platform_id]
  );

  return rows.length === 0;
}

async function updateProduct(id, launch_date, price) {
  await pool.query(
    `
      UPDATE products
      SET launch_date = $2, price = $3
      WHERE id = $1;
    `,
    [id, launch_date, price]
  );
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  isProductUnique,
  updateProduct,
};
