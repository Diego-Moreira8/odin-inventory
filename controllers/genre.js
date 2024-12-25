const { body, validationResult } = require("express-validator");
const db = require("../db/allQueries");
const renderErrorPage = require("../utils/renderErrorPage");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/genre";
const errorMessage = "Gênero não encontrado!";

const validateForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("O gênero precisa ter um nome.")
    .isLength({ max: 50 })
    .withMessage("O nome do gênero pode ter no máximo 50 caracteres.")
    .custom(async (value, { req }) => {
      const { name, currentName } = req.body;
      const noChangesMade = name === currentName;

      if (noChangesMade) return;

      const alreadyExists = !(await db.genres.validateUniqueName(name));

      if (alreadyExists) {
        throw new Error("Já existe um gênero com este nome.");
      }
    }),
];

async function detailsGet(req, res, next) {
  const genre = await db.genres.getGenre(req.params.id);

  if (!genre) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const gamesWithGenre = await db.games.getGamesWithGenre(req.params.id);

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: `Detalhes do Gênero: ${genre.name}`,
    genre,
    gamesWithGenre,
  });
}

async function createGet(req, res, next) {
  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Criar Gênero",
    isEdit: false,
    currentName: "",
    genre: {},
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
        title: "Criar Gênero",
        isEdit: false,
        currentName: "",
        genre: req.body,
        errors: errors.array(),
      });
    }

    const id = await db.genres.createGenre(req.body.name);
    res.redirect(`/genero/${id}`);
  },
];

async function updateGet(req, res, next) {
  const genre = await db.genres.getGenre(req.params.id);

  if (!genre) {
    return renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: `Editar Gênero: ${genre.name}`,
    errors: [],
    isEdit: true,
    currentName: genre.name,
    genre,
  });
}

const updatePost = [
  validateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const genre = await db.genres.getGenre(req.params.id);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: `Editar Gênero: ${genre.name}`,
        errors: errors.array(),
        isEdit: true,
        currentName: req.body.currentName,
        genre: req.body,
      });
    }

    await db.genres.updateGenre(req.body.id, req.body.name);
    res.redirect(`/genero/${req.body.id}`);
  },
];

async function deleteGet(req, res, next) {
  const genre = await db.genres.getGenre(req.params.id);

  if (!genre) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const gamesWithGenre = await db.games.getGamesWithGenre(req.params.id);

  res.render(layoutView, {
    partial: `${viewsDirectory}/delete`,
    title: `Apagar Gênero: ${genre.name}`,
    genre,
    gamesWithGenre,
  });
}

async function deletePost(req, res, next) {
  await db.genres.deleteGenre(req.body.id);
  res.redirect("/generos");
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
