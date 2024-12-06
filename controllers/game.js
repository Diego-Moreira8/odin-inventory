const { body, validationResult } = require("express-validator");
const gamesDB = require("../db/queries/game");
const developersDB = require("../db/queries/developer");
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

  body("developer")
    .trim()
    .notEmpty()
    .withMessage("Um desenvolvedor precisa ser selecionado."),
];

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
  const allDevelopers = await developersDB.getAllDevelopers();

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Criar Jogo",
    isEdit: false,
    errors: [],
    game: {},
    allDevelopers,
  });
}

const createPost = [
  validateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const allDevelopers = await developersDB.getAllDevelopers();

      console.log(req.body);

      return res.render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: "Criar Jogo",
        isEdit: false,
        errors: errors.array(),
        game: req.body,
        allDevelopers,
      });
    }

    const { title, description, website, developer_id } = req.body;
    const newGame = await gamesDB.createGame(
      title,
      description,
      website,
      developer_id
    );

    res.redirect(`/jogo/${newGame.id}`);
  },
];

module.exports = { detailsGet, createGet, createPost };
