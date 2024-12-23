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
      "Há mais de duas décadas, o Counter-Strike oferece uma experiência competitiva de elite moldada por milhões de jogadores mundialmente. Agora, o próximo capítulo da história do CS vai começar. Isso é Counter-Strike 2.",
      "https://www.counter-strike.net/",
      developers[9]
    ),
    insertGame(
      1,
      "The Witcher 3: Wild Hunt",
      "Você é Geralt de Rívia, mercenário matador de monstros. Você está em um continente devastado pela guerra e infestado de monstros para você explorar à vontade. Sua tarefa é encontrar Ciri, a Criança da Profecia — uma arma viva que pode alterar a forma do mundo.",
      "https://www.thewitcher.com/br/pt-br/witcher3",
      developers[1]
    ),
    insertGame(
      2,
      "The Elder Scrolls V: Skyrim",
      "Skyrim é um RPG de mundo aberto ambientado na província fictícia de Tamriel. O jogador assume o papel do Dragonborn, um herói destinado a derrotar Alduin, o Devorador de Mundos. Com gráficos imersivos, combates dinâmicos e uma vasta liberdade para explorar, o jogo oferece inúmeras quests, facções e habilidades para personalizar o personagem. Lançado pela Bethesda, é aclamado por sua narrativa rica e universo envolvente.",
      "https://elderscrolls.bethesda.net/pt/skyrim10",
      developers[0]
    ),
    insertGame(
      3,
      "Stardew Valley",
      "Você herdou a antiga fazenda do seu avô, em Stardew Valley. Com ferramentas de segunda-mão e algumas moedas, você parte para dar início a sua nova vida. Será que você vai aprender a viver da terra, a transformar esse matagal em um próspero lar?",
      "https://www.stardewvalley.net/",
      developers[2]
    ),
    insertGame(
      4,
      "Tomb Raider",
      "Tomb Raider explora a intensa história da origem de Lara Croft, e sua ascensão de uma jovem mulher a uma sobrevivente experiente.",
      "https://www.tombraider.com/",
      developers[7]
    ),
    insertGame(
      5,
      "Rise of the Tomb Raider",
      "Rise of the Tomb Raider é um jogo de ação e aventura que segue Lara Croft em sua busca pela mítica cidade de Kitezh, em uma jornada para desvendar o segredo da imortalidade. Situado em ambientes deslumbrantes e perigosos, combina exploração, combate e resolução de enigmas. Com gráficos impressionantes e uma história emocionante, o jogo aprofunda o desenvolvimento de Lara como exploradora e sobrevivente.",
      "https://www.tombraider.com/",
      developers[7]
    ),
    insertGame(
      6,
      "Shadow of the Tomb Raider",
      "Shadow of the Tomb Raider é um jogo de ação e aventura que conclui a jornada de Lara Croft para se tornar a lendária exploradora. Situado na América Central e do Sul, Lara enfrenta a Trindade enquanto tenta impedir um apocalipse maia. Com paisagens exuberantes, tumbas desafiadoras e mecânicas de stealth aprimoradas, o jogo combina narrativa envolvente, exploração intensa e perigos ocultos em cada canto.",
      "https://www.tombraider.com/",
      developers[7]
    ),
    insertGame(
      7,
      "Cyberpunk 2077",
      "Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto que se passa em Night City, uma megalópole perigosa onde todos são obcecados por poder, glamour e alterações corporais.",
      "https://www.cyberpunk.net/",
      developers[1]
    ),
    insertGame(
      8,
      "Red Dead Redemption II",
      "Arthur Morgan e a gangue Van der Linde são bandidos em fuga. Com agentes federais e os melhores caçadores de recompensas no seu encalço, a gangue precisa roubar, assaltar e lutar para sobreviver no impiedoso coração dos Estados Unidos. Conforme divisões internas profundas ameaçam despedaçar a gangue, Arthur deve fazer uma escolha entre os seus próprios ideais e a lealdade à gangue que o criou.",
      "https://www.rockstargames.com/reddeadredemption2/",
      developers[6]
    ),
    insertGame(
      9,
      "Outer Wilds",
      "Ganhador do Jogo do Ano de 2019 pela Giant Bomb, Polygon, Eurogamer e The Guardian, Outer Wilds é um jogo de mistério de mundo aberto aclamado pela crítica que retrata um sistema solar fadado a um loop temporal perpétuo.",
      "https://www.mobiusdigitalgames.com/outer-wilds.html",
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
    insertProduct(1, games[1], platforms[0], "2015-05-19", 129.99),
    insertProduct(2, games[1], platforms[1], "2015-05-19", 129.99),
    insertProduct(3, games[1], platforms[9], "2015-05-19", 129.99),
    insertProduct(4, games[1], platforms[11], "2019-10-15", 129.99),
    insertProduct(5, games[1], platforms[10], "2022-01-01", 129.99),
    insertProduct(6, games[1], platforms[5], "2022-01-01", 129.99),
    insertProduct(7, games[2], platforms[0], "2011-11-11", 50),
    insertProduct(8, games[2], platforms[8], "2011-11-11", 50),
    insertProduct(9, games[3], platforms[0], "2016-02-26", 20.9),
    insertProduct(10, games[4], platforms[0], "2013-03-05", 9.9),
    insertProduct(11, games[4], platforms[8], "2013-03-05", 19.9),
    insertProduct(12, games[5], platforms[0], "2016-01-28", 34.9),
    insertProduct(13, games[5], platforms[1], "2015-11-10", 54.9),
    insertProduct(14, games[5], platforms[9], "2016-10-11", 79.9),
    insertProduct(15, games[6], platforms[0], "2018-09-14", 49.9),
    insertProduct(16, games[6], platforms[9], "2018-09-14", 79.9),
    insertProduct(17, games[6], platforms[1], "2018-09-14", 79.9),
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
