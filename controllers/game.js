const { body, validationResult } = require("express-validator");
const db = require("../db/allQueries");
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
    .isLength({ max: 500 })
    .withMessage("A descrição pode ter no máximo 500 caracteres."),

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
  const game = await db.games.getGame(req.params.id);

  if (!game) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const [genres, productsForGame] = await Promise.all([
    db.games.getGameGenres(req.params.id),
    db.products.getProductsForGame(req.params.id),
  ]);

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: `Detalhes do Jogo: ${game.title}`,
    game,
    genres,
    productsForGame,
  });
}

async function createGet(req, res, next) {
  const [allDevelopers, allGenres] = await Promise.all([
    db.developers.getAllDevelopers(),
    db.genres.getAllGenres(),
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
        db.developers.getAllDevelopers(),
        db.genres.getAllGenres(),
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
    const id = await db.games.createGame(
      title,
      description,
      website,
      developer_id
    );

    await db.games.createGameGenreRelation(id, genres);

    res.redirect(`/jogo/${id}`);
  },
];

async function updateGet(req, res, next) {
  const game = await db.games.getGame(req.params.id);

  if (!game) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const [allDevelopers, allGenres, gameGenres] = await Promise.all([
    db.developers.getAllDevelopers(),
    db.genres.getAllGenres(),
    db.games.getGameGenres(req.params.id),
  ]);

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: `Editar Jogo: ${game.title}`,
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
        db.developers.getAllDevelopers(),
        db.genres.getAllGenres(),
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

    const { id, title, description, website, developer_id, genres } = req.body;
    await db.games.updateGame(id, title, description, website, developer_id);
    await db.games.deleteGameGenreRelation(id);
    await db.games.createGameGenreRelation(id, genres);

    res.redirect(`/jogo/${id}`);
  },
];

async function deleteGet(req, res, next) {
  const game = await db.games.getGame(req.params.id);

  if (!game) {
    return renderErrorPage(res, 404, errorMessage);
  }

  const productsForGame = await db.products.getProductsForGame(req.params.id);

  res.render(layoutView, {
    partial: `${viewsDirectory}/delete`,
    title: `Apagar jogo: ${game.title}`,
    game,
    productsForGame,
  });
}

async function deletePost(req, res, next) {
  await db.games.deleteGame(req.body.id);
  res.redirect("/jogos");
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
