const db = require("../db/queries/game");

async function listGet(req, res, next) {
  const allGames = await db.getAllGames();
  res.render("layouts/layout", {
    partial: "../pages/games/list",
    title: "Todos os Jogos",
    allGames,
  });
}

module.exports = { listGet };
