const db = require("../db/queries/genre");

async function listAllGet(req, res, next) {
  const allGenres = await db.getAllGenres();

  res.render("layouts/layout", {
    partial: "../pages/genres/list",
    title: "Todos os Gêneros",
    allGenres,
  });
}

module.exports = { listAllGet };
