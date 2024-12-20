const pool = require("./pool");
const db = require("./allQueries");
const { createTables } = require("./createTables");

const genres = [];
const developers = [];
const games = [];
const gamesGenres = [];
const platforms = [];
const products = [];

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

async function insertGameGenresRelation(index, game_id, genre_ids) {
  gamesGenres[index] = await db.games.createGameGenreRelation(
    game_id,
    genre_ids
  );

  console.log(`Inserted game-genre relation: ${game_id}- ${genre_ids}`);
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

async function insertGamesGenresRelations() {
  console.log("Start inserting games-genres relations");
  await Promise.all([
    insertGameGenresRelation(0, games[0], [genres[0], genres[1], genres[5]]),
    insertGameGenresRelation(1, games[1], [genres[2], genres[3], genres[6]]),
    insertGameGenresRelation(2, games[2], [genres[2], genres[3], genres[6]]),
    insertGameGenresRelation(3, games[3], [genres[2], genres[3]]),
    insertGameGenresRelation(4, games[4], [genres[3], genres[5], genres[6]]),
    insertGameGenresRelation(5, games[5], [genres[3], genres[5], genres[6]]),
    insertGameGenresRelation(6, games[6], [genres[3], genres[5], genres[6]]),
  ]);
  console.log("Done inserting games-genres relations");
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
    insertProduct(0, games[0], platforms[0], "2023-09-27", 0),
    insertProduct(1, games[0], platforms[1], "2023-09-27", 0),
    insertProduct(2, games[0], platforms[2], "2023-09-27", 0),
    insertProduct(3, games[1], platforms[2], "2023-09-27", 0),
    insertProduct(4, games[2], platforms[2], "2023-09-27", 0),
  ]);
  console.log("Done inserting products");
}

async function main() {
  await dropTables();
  await createTables();
  await insertDevelopers();
  await insertGenres();
  await insertGames();
  await insertGamesGenresRelations();
  await insertPlatforms();
  await insertProducts();
}

main();
