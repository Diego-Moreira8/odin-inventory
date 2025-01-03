const { body, validationResult } = require("express-validator");

const db = require("../db/allQueries");
const renderErrorPage = require("../utils/renderErrorPage");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/developer";
const errorMessage = "Desenvolvedor não encontrado!";

const validateForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("O desenvolvedor precisa ter um nome.")
    .isLength({ max: 50 })
    .withMessage("O nome do desenvolvedor pode ter no máximo 50 caracteres.")
    .custom(async (value, { req }) => {
      const { name, currentName } = req.body;
      const noChangesMade = name === currentName;

      if (noChangesMade) return;

      const alreadyExists = !(await db.developers.validateUniqueName(name));

      if (alreadyExists) {
        throw new Error("Já existe um desenvolvedor com este nome.");
      }
    }),
];

async function detailsGet(req, res, next) {
  const developer = await db.developers.getDeveloper(req.params.id);

  if (!developer) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const gamesFromDeveloper = await db.games.getGamesFromDeveloper(
    req.params.id
  );

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: `Detalhes do Desenvolvedor: ${developer.name}`,
    developer,
    gamesFromDeveloper,
  });
}

async function createGet(req, res, next) {
  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Criar Desenvolvedor",
    isEdit: false,
    currentName: "",
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
        currentName: "",
        developer: req.body,
        errors: errors.array(),
      });
    }

    const id = await db.developers.createDeveloper(req.body.name);
    res.redirect(`/desenvolvedor/${id}`);
  },
];

async function updateGet(req, res, next) {
  const developer = await db.developers.getDeveloper(req.params.id);

  if (!developer) {
    return renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: `Editar Desenvolvedor: ${developer.name}`,
    errors: [],
    currentName: developer.name,
    isEdit: true,
    developer,
  });
}

const updatePost = [
  validateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const developer = await db.developers.getDeveloper(req.params.id);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: `Editar Desenvolvedor: ${developer.name}`,
        errors: errors.array(),
        isEdit: true,
        currentName: req.body.currentName,
        developer: req.body,
      });
    }

    await db.developers.updateDeveloper(req.body.id, req.body.name);
    res.redirect(`/desenvolvedor/${req.body.id}`);
  },
];

async function deleteGet(req, res, next) {
  const developer = await db.developers.getDeveloper(req.params.id);

  if (!developer) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const gamesFromDeveloper = await db.games.getGamesFromDeveloper(
    req.params.id
  );

  res.render(layoutView, {
    partial: `${viewsDirectory}/delete`,
    title: `Apagar Desenvolvedor: ${developer.name}`,
    developer,
    gamesFromDeveloper,
  });
}

async function deletePost(req, res, next) {
  await db.developers.deleteDeveloper(req.body.id);
  res.redirect("/desenvolvedores");
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
