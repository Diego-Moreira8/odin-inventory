const { body, validationResult } = require("express-validator");
const db = require("../db/allQueries");
const renderErrorPage = require("../utils/renderErrorPage");
const formatDate = require("../utils/formatDate");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/product";
const errorMessage = "Produto não encontrado!";

const validateForm = [];

async function detailsGet(req, res, next) {
  const product = await db.products.getProduct(req.params.id);

  if (!product) {
    renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: `Detalhes do Produto: ${product.game_title} (${product.platform_name})`,
    product: { ...product, launch_date: formatDate(product.launch_date) },
  });
}

async function createGet(req, res, next) {
  const [allGames, allPlatforms] = await Promise.all([
    db.games.getAllGames(),
    db.platforms.getAllPlatforms(),
  ]);

  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: "Novo Produto",
    isEdit: false,
    errors: [],
    product: {},
    allGames,
    allPlatforms,
  });
}

module.exports = { detailsGet, createGet };
