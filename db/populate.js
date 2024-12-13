const pool = require("./pool");
const db = require("./allQueries");

const genres = [];
const developers = [];
const games = [];
const platforms = [];
const products = [];

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
        launch_date DATE,
        price NUMERIC(9, 2),
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (platform_id) REFERENCES platforms(id)
      );
    `
  );

  console.log("Done creating tables");
}

async function dropTables() {
  console.log("Start dropping all tables");

  await pool.query(
    `
      DROP TABLE
        genres,
        developers,
        games,
        games_genres,
        platforms,
        products;
    `
  );

  console.log("Done dropping all tables");
}

async function insertGenre(index, name) {
  genres[index] = await db.genres.createGenre(name);
  console.log(`Inserted genre: ${name}`);
}

async function insertDeveloper(index, name) {
  developers[index] = await db.developers.createDeveloper(name);
  console.log(`Inserted developer: ${name}`);
}

async function insertGame(index, title, description, website, developer_id) {
  games[index] = await db.games.createGame(
    title,
    description,
    website,
    developer_id
  );
  console.log(`Inserted game: ${title}`);
}

async function insertPlatform(index, name) {
  platforms[index] = await db.platforms.createPlatform(name);
  console.log(`Inserted platform: ${name}`);
}

async function insertProduct(index, game_id, platform_id, launch_date, price) {
  products[index] = await db.products.createProduct(
    game_id,
    platform_id,
    launch_date,
    price
  );

  console.log(`Inserted product: ${game_id}-${platform_id}`);
}

async function insertGenres() {
  console.log("Start inserting genres");

  await Promise.all([
    insertGenre(0, "FPS"),
    insertGenre(1, "MMO"),
    insertGenre(2, "RPG"),
    insertGenre(3, "Aventura"),
    insertGenre(4, "Corrida"),
    insertGenre(5, "Tiro"),
    insertGenre(6, "Terceira Pessoa"),
    insertGenre(7, "Terror"),
  ]);

  console.log("Done inserting genres");
}

async function insertDevelopers() {
  console.log("Start inserting developers");

  await Promise.all([
    insertDeveloper(0, "Bethesda"),
    insertDeveloper(1, "CD Projekt RED"),
    insertDeveloper(2, "Concerned Ape"),
    insertDeveloper(3, "Electronic Arts"),
    insertDeveloper(4, "Microsoft"),
    insertDeveloper(5, "Mobius Digital"),
    insertDeveloper(6, "Rockstar Games"),
    insertDeveloper(7, "Square Enix"),
    insertDeveloper(8, "Ubisoft"),
    insertDeveloper(9, "Valve"),
  ]);

  console.log("Done inserting developers");
}

async function insertGames() {
  console.log("Start inserting games");

  await Promise.all([
    insertGame(
      0,
      "Counter Strike 2",
      "Descrição.",
      "https://www.google.com/",
      developers[9]
    ),
    insertGame(
      1,
      "The Witcher 3: Wild Hunt",
      "Descrição.",
      "https://www.google.com/",
      developers[1]
    ),
    insertGame(
      2,
      "The Elder Scrolls V: Skyrim",
      "Descrição.",
      "https://www.google.com/",
      developers[0]
    ),
    insertGame(
      3,
      "Stardew Valley",
      "Descrição.",
      "https://www.google.com/",
      developers[2]
    ),
    insertGame(
      4,
      "Tomb Raider",
      "Descrição.",
      "https://www.google.com/",
      developers[7]
    ),
    insertGame(
      5,
      "Rise of the Tomb Raider",
      "Descrição.",
      "https://www.google.com/",
      developers[7]
    ),
    insertGame(
      6,
      "Shadow of the Tomb Raider",
      "Descrição.",
      "https://www.google.com/",
      developers[7]
    ),
    insertGame(
      7,
      "Cyberpunk 2077",
      "Descrição.",
      "https://www.google.com/",
      developers[1]
    ),
    insertGame(
      8,
      "Red Dead Redemption II",
      "Descrição.",
      "https://www.google.com/",
      developers[6]
    ),
    insertGame(
      9,
      "Outer Wilds",
      "Descrição.",
      "https://www.google.com/",
      developers[5]
    ),
  ]);

  console.log("Done inserting games");
}

async function insertPlatforms() {
  console.log("Start inserting platforms");

  await Promise.all([
    insertPlatform(0, "PC"),
    insertPlatform(1, "X-Box One"),
    insertPlatform(2, "X-Box One S"),
    insertPlatform(3, "X-Box One X"),
    insertPlatform(4, "X-Box Series X"),
    insertPlatform(5, "X-Box Series S"),
    insertPlatform(6, "PlayStation 1"),
    insertPlatform(7, "PlayStation 2"),
    insertPlatform(8, "PlayStation 3"),
    insertPlatform(9, "PlayStation 4"),
    insertPlatform(10, "PlayStation 5"),
    insertPlatform(11, "Nintendo Switch"),
  ]);

  console.log("Done inserting platforms");
}

async function insertProducts() {
  console.log("Start inserting products");
  await Promise.all([
    insertProduct(0, games[0], platforms[0], "2024-01-01", 19.9),
  ]);
  console.log("Done inserting products");
}

async function main() {
  await dropTables();
  await createTables();
  await insertDevelopers();
  await insertGenres();
  await insertGames();
  await insertPlatforms();
  await insertProducts();
}

main();
