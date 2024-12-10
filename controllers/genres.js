const db = require("../db/allQueries");

async function listAllGet(req, res, next) {
  const allGenres = await db.genres.getAllGenres();

  res.render("layouts/layout", {
    partial: "../pages/genres/list",
    title: "Todos os Gêneros",
    allGenres,
  });
}

module.exports = { listAllGet };
