const { body, validationResult } = require("express-validator");

const db = require("../db/queries");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/developer";

const validateForm = [
  body("developer")
    .trim()
    .notEmpty()
    .withMessage("O desenvolvedor precisa ter um nome.")
    .isLength({ max: 50 })
    .withMessage("O nome do desenvolvedor pode ter no máximo 50 caracteres."),
];

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
    partial: `${viewsDirectory}/form`,
    title: "Criar Desenvolvedor",
    isEdit: false,
    developer: {},
    errors: [],
  });
}

const createPost = [
  validateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: "Criar Desenvolvedor",
        isEdit: false,
        developer: { name: req.body.developer },
        errors: errors.array(),
      });
    }

    await db.createDeveloper(req.body.developer);
    res.send(req.body.developer);
  },
];

async function updateGet(req, res, next) {
  const developer = await db.getDeveloper(req.params.id);

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: `Editar Desenvolvedor: ${developer.name}`,
    errors: [],
    isEdit: true,
    developer,
  });
}

async function updatePost(req, res, next) {
  console.log(req.body.name);
  await db.updateDeveloper(req.body.id, req.body.developer);
  res.redirect(`/desenvolvedor/${req.body.id}`);
}

module.exports = { detailsGet, createGet, createPost, updateGet, updatePost };
