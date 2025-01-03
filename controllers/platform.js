const { body, validationResult } = require("express-validator");
const db = require("../db/allQueries");
const renderErrorPage = require("../utils/renderErrorPage");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/platform";
const errorMessage = "Plataforma não encontrada!";

const validateForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("A plataforma precisa ter um nome.")
    .isLength({ max: 50 })
    .withMessage("O nome da plataforma pode ter no máximo 50 caracteres.")
    .custom(async (value, { req }) => {
      const { name, currentName } = req.body;
      const noChangesMade = name === currentName;

      if (noChangesMade) return;

      const alreadyExists = !(await db.platforms.validateUniqueName(name));

      if (alreadyExists) {
        throw new Error("Já existe uma plataforma com este nome.");
      }
    }),
];

async function detailsGet(req, res, next) {
  const platform = await db.platforms.getPlatform(req.params.id);

  if (!platform) return renderErrorPage(res, 404, errorMessage);

  const productsForPlatform = await db.products.getProductsForPlatform(
    req.params.id
  );

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: `Detalhes da Plataforma: ${platform.name}`,
    platform,
    productsForPlatform,
  });
}

async function createGet(req, res, next) {
  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Criar Plataforma",
    isEdit: false,
    currentName: "",
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
        currentName: "",
        platform: req.body,
        errors: errors.array(),
      });
    }

    const id = await db.platforms.createPlatform(req.body.name);
    res.redirect(`/plataforma/${id}`);
  },
];

async function updateGet(req, res, next) {
  const platform = await db.platforms.getPlatform(req.params.id);

  if (!platform) {
    return renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: `Editar Plataforma: ${platform.name}`,
    errors: [],
    currentName: platform.name,
    isEdit: true,
    platform,
  });
}

const updatePost = [
  validateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const platform = await db.platforms.getPlatform(req.params.id);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: `Editar Plataforma: ${platform.name}`,
        errors: errors.array(),
        currentName: req.body.currentName,
        isEdit: true,
        platform: req.body,
      });
    }

    await db.platforms.updatePlatform(req.body.id, req.body.name);
    res.redirect(`/plataforma/${req.body.id}`);
  },
];

async function deleteGet(req, res, next) {
  const platform = await db.platforms.getPlatform(req.params.id);

  if (!platform) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const productsForPlatform = await db.products.getProductsForPlatform(
    req.params.id
  );

  res.render(layoutView, {
    partial: `${viewsDirectory}/delete`,
    title: `Apagar Plataforma: ${platform.name}`,
    platform,
    productsForPlatform,
  });
}

async function deletePost(req, res, next) {
  await db.platforms.deletePlatform(req.body.id);
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
