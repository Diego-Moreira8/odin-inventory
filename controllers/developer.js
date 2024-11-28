const db = require("../db/queries");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/developer";

async function detailsGet(req, res, next) {
  const developer = await db.getDeveloper(req.params.id);
  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: developer.name,
    developer,
  });
}

async function createGet(req, res, next) {
  res.render(layoutView, {
    partial: `${viewsDirectory}/createDeveloper`,
    title: "Criar Desenvolvedor",
  });
}

async function createPost(req, res, next) {
  await db.createDeveloper(req.body.developer);
  res.send(req.body.developer);
}

module.exports = { detailsGet, createGet, createPost };
