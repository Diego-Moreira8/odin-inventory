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
    partial: `${viewsDirectory}/create`,
    title: "Criar Desenvolvedor",
    developer: {},
  });
}

async function createPost(req, res, next) {
  await db.createDeveloper(req.body.developer);
  res.send(req.body.developer);
}

async function updateGet(req, res, next) {
  const developer = await db.getDeveloper(req.params.id);

  res.render(layoutView, {
    partial: `${viewsDirectory}/create`,
    title: `Editar Desenvolvedor: ${developer.name}`,
    developer,
  });
}

async function updatePost(req, res, next) {
  console.log(req.body.name);
  await db.updateDeveloper(req.params.id, req.body.developer);
  res.redirect(`/desenvolvedor/${req.params.id}`);
}

module.exports = { detailsGet, createGet, createPost, updateGet, updatePost };
