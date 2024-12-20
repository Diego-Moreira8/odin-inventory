const pool = require("./pool");

async function createTables() {
  console.log("Started creating tables");

  await pool.query(
    `
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE IF NOT EXISTS developers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE,
        description TEXT,
        website TEXT,
        developer_id INT NOT NULL,
        FOREIGN KEY (developer_id) REFERENCES developers(id)
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE IF NOT EXISTS games_genres (
        game_id INT NOT NULL,
        genre_id INT NOT NULL,
        PRIMARY KEY (game_id, genre_id),
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE IF NOT EXISTS platforms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL,
        game_id INT NOT NULL,
        platform_id INT NOT NULL,
        PRIMARY KEY (game_id, platform_id),
        launch_date DATE NOT NULL,
        price NUMERIC(9, 2) NOT NULL,
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (platform_id) REFERENCES platforms(id)
      );
    `
  );

  console.log("Done creating tables");
}

async function main() {
  await createTables();
}

main();

module.exports = { createTables };
