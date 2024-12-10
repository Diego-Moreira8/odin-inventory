const { body, validationResult } = require("express-validator");
const gamesDB = require("../db/queries/game");
const developersDB = require("../db/queries/developer");
const genresDB = require("../db/queries/genre");
const renderErrorPage = require("../utils/renderErrorPage");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/game";
const errorMessage = "Jogo não encontrado!";

const validateForm = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("O jogo precisa ter um título.")
    .isLength({ max: 100 })
    .withMessage("O título do jogo pode ter no máximo 100 caracteres."),

  body("description")
    .trim()
    .isLength({ max: 250 })
    .withMessage("A descrição pode ter no máximo 250 caracteres."),

  body("website")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ max: 100 })
    .withMessage("O URL do site oficial pode ter no máximo 100 caracteres.")
    .isURL()
    .withMessage("O formato do URL do site oficial parece estar incorreto."),

  body("developer_id")
    .trim()
    .notEmpty()
    .withMessage("Um desenvolvedor precisa ser selecionado."),
];

function ensureArrayToCheckboxes(req, res, next) {
  if (!Array.isArray(req.body.genres)) {
    req.body.genres =
      typeof req.body.genres === "undefined" ? [] : [req.body.genres];
  }
  next();
}

async function detailsGet(req, res, next) {
  const [game, genres] = await Promise.all([
    gamesDB.getGame(req.params.id),
    gamesDB.getGameGenres(req.params.id),
  ]);

  if (!game) {
    return renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: game.title,
    game,
    genres,
  });
}

async function createGet(req, res, next) {
  const [allDevelopers, allGenres] = await Promise.all([
    developersDB.getAllDevelopers(),
    genresDB.getAllGenres(),
  ]);

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Criar Jogo",
    isEdit: false,
    errors: [],
    game: {},
    gameGenres: [],
    allDevelopers,
    allGenres,
  });
}

const createPost = [
  validateForm,
  ensureArrayToCheckboxes,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [allDevelopers, allGenres] = await Promise.all([
        developersDB.getAllDevelopers(),
        genresDB.getAllGenres(),
      ]);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: "Criar Jogo",
        isEdit: false,
        errors: errors.array(),
        game: req.body,
        gameGenres: req.body.genres,
        allDevelopers,
        allGenres,
      });
    }

    const { title, description, website, developer_id, genres } = req.body;
    const newGame = await gamesDB.createGame(
      title,
      description,
      website,
      developer_id
    );

    await gamesDB.createGameGenreRelation(newGame.id, genres);

    res.redirect(`/jogo/${newGame.id}`);
  },
];

async function updateGet(req, res, next) {
  const game = await gamesDB.getGame(req.params.id);

  if (!game) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const [allDevelopers, allGenres, gameGenres] = await Promise.all([
    developersDB.getAllDevelopers(),
    genresDB.getAllGenres(),
    gamesDB.getGameGenres(req.params.id),
  ]);

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Editar Jogo",
    isEdit: true,
    errors: [],
    game,
    gameGenres: gameGenres.map((g) => g.id),
    allDevelopers,
    allGenres,
  });
}

const updatePost = [
  validateForm,
  ensureArrayToCheckboxes,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [allDevelopers, allGenres] = await Promise.all([
        developersDB.getAllDevelopers(),
        genresDB.getAllGenres(),
      ]);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: "Editar Jogo",
        isEdit: true,
        errors: errors.array(),
        game: req.body,
        gameGenres: req.body.genres,
        allDevelopers,
        allGenres,
      });
    }

    const { id, title, description, website, developer_id } = req.body;
    await gamesDB.updateGame(id, title, description, website, developer_id);

    // TODO: update genres

    res.redirect(`/jogo/${id}`);
  },
];

module.exports = { detailsGet, createGet, createPost, updateGet, updatePost };
