const db = require("../db/queries/developer");

async function listAllGet(req, res, next) {
  const allDevelopers = await db.getAllDevelopers();

  res.render("layouts/layout", {
    partial: "../pages/developers/list",
    title: "Todos os Desenvolvedores",
    allDevelopers,
  });
}

module.exports = { listAllGet };
