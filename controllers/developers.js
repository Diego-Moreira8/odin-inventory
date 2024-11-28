const db = require("../db/queries");

async function createGet(req, res, next) {
  res.render("layout", { partial: "createDev", title: "Criar Desenvolvedor" });
}

async function createPost(req, res, next) {
  await db.createDeveloper(req.body.developer);
  res.send(req.body.developer);
}

module.exports = { createGet, createPost };
