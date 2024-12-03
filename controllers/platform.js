const { body, validationResult } = require("express-validator");

const db = require("../db/queries/platform");
const renderErrorPage = require("../utils/renderErrorPage");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/platform";
const errorMessage = "Plataforma não encontrada!";

const validateForm = [
  body("platform")
    .trim()
    .notEmpty()
    .withMessage("A plataforma precisa ter um nome.")
    .isLength({ max: 50 })
    .withMessage("O nome da plataforma pode ter no máximo 50 caracteres."),
];

async function detailsGet(req, res, next) {
  const platform = await db.getPlatform(req.params.id);

  if (!platform) {
    return renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: platform.name,
    platform,
  });
}

async function createGet(req, res, next) {
  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Criar Plataforma",
    isEdit: false,
    platform: {},
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
        title: "Criar Plataforma",
        isEdit: false,
        platform: { name: req.body.platform },
        errors: errors.array(),
      });
    }

    const { id } = await db.createPlatform(req.body.platform);
    res.redirect(`/plataforma/${id}`);
  },
];

async function updateGet(req, res, next) {
  const platform = await db.getPlatform(req.params.id);

  if (!platform) {
    return renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: `Editar Plataforma: ${platform.name}`,
    errors: [],
    isEdit: true,
    platform,
  });
}

const updatePost = [
  validateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const platform = await db.getPlatform(req.params.id);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: `Editar Plataforma: ${platform.name}`,
        errors: errors.array(),
        isEdit: true,
        platform: { name: req.body.platform },
      });
    }

    await db.updatePlatform(req.body.id, req.body.platform);
    res.redirect(`/plataforma/${req.body.id}`);
  },
];

async function deleteGet(req, res, next) {
  const platform = await db.getPlatform(req.params.id);

  if (!platform) {
    return renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/delete`,
    title: `Apagar Plataforma: ${platform.name}`,
    platform,
  });
}

async function deletePost(req, res, next) {
  await db.deletePlatform(req.body.id);
  res.redirect("/plataformas");
}

module.exports = {
  detailsGet,
  createGet,
  createPost,
  updateGet,
  updatePost,
  deleteGet,
  deletePost,
};
