const gamesDB = require("../db/queries/game");
const developersDB = require("../db/queries/developer");
const renderErrorPage = require("../utils/renderErrorPage");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/game";
const errorMessage = "Jogo não encontrado!";

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

module.exports = { detailsGet, createGet };
