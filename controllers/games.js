const db = require("../db/allQueries");

async function listGet(req, res, next) {
  const allGames = await db.games.getAllGames();
  res.render("layouts/layout", {
    partial: "../pages/games/list",
    title: "Todos os Jogos",
    allGames,
  });
}

module.exports = { listGet };
