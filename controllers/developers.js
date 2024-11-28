const db = require("../db/queries");

async function listAllGet(req, res, next) {
  const allDevelopers = await db.getAllDevelopers();
  res.render("layouts/layout", {
    partial: "../pages/developers/listDevelopers",
    title: "Desenvolvedores",
    allDevelopers,
  });
}

module.exports = { listAllGet };
