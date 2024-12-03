const db = require("../db/queries/platform");

async function listAllGet(req, res, next) {
  const allPlatforms = await db.getAllPlatforms();

  res.render("layouts/layout", {
    partial: "../pages/platforms/list",
    title: "Todas as Plataformas",
    allPlatforms,
  });
}

module.exports = { listAllGet };
