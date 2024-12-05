const db = require("../db/queries/game");
const renderErrorPage = require("../utils/renderErrorPage");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/game";
const errorMessage = "Jogo não encontrado!";

async function detailsGet(req, res, next) {
  const [game, genres] = await Promise.all([
    db.getGame(req.params.id),
    db.getGameGenres(req.params.id),
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

module.exports = { detailsGet };
