const db = require("../db/allQueries");

async function listAllGet(req, res, next) {
  const allDevelopers = await db.developers.getAllDevelopers();

  res.render("layouts/layout", {
    partial: "../pages/developers/list",
    title: "Todos os Desenvolvedores",
    allDevelopers,
  });
}

module.exports = { listAllGet };
