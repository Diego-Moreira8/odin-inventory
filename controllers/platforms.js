const db = require("../db/allQueries");

async function listAllGet(req, res, next) {
  const allPlatforms = await db.platforms.getAllPlatforms();

  res.render("layouts/layout", {
    partial: "../pages/platforms/list",
    title: "Todas as Plataformas",
    allPlatforms,
  });
}

module.exports = { listAllGet };
