const { body, validationResult } = require("express-validator");
const db = require("../db/allQueries");
const renderErrorPage = require("../utils/renderErrorPage");
const formatDate = require("../utils/formatDate");

const layoutView = "layouts/layout";
const viewsDirectory = "../pages/product";
const errorMessage = "Produto não encontrado!";

const validateUpdateForm = [
  body("launch_date")
    .trim()
    .isDate()
    .withMessage("O formato de data de lançamento parece estar incorreto.")
    .notEmpty()
    .withMessage("O campo de data de lançamento não pode estar vazio."),

  body("price")
    .trim()
    .isNumeric()
    .withMessage("O campo de preço só pode conter valores numéricos.")
    .notEmpty()
    .withMessage("O campo de preço não pode estar vazio."),
];

const validateCreateForm = [
  ...validateUpdateForm,

  body("game_id")
    .trim()
    .notEmpty()
    .withMessage("Um jogo precisa ser selecionado."),

  body("platform_id")
    .trim()
    .notEmpty()
    .withMessage("Uma plataforma precisa ser selecionada.")
    .custom(async (value, { req }) => {
      const { game_id, platform_id } = req.body;
      const missingFields = game_id === "" || platform_id === "";

      if (missingFields) return;

      const alreadyExists = !(await db.products.isProductUnique(
        game_id,
        platform_id
      ));

      if (alreadyExists) {
        throw new Error(
          `Já existe um produto cadastrado para este jogo nesta plataforma.
          Cada jogo pode estar associado a apenas uma plataforma por vez!`
        );
      }
    }),
];

async function detailsGet(req, res, next) {
  const product = await db.products.getProduct(req.params.id);

  if (!product) {
    renderErrorPage(res, 404, errorMessage);
  }

  res.render(layoutView, {
    partial: `${viewsDirectory}/details`,
    title: `Detalhes do Produto: ${product.game_title} (${product.platform_name})`,
    product: {
      ...product,
      launch_date: formatDate.toBrazilianDate(product.launch_date),
      price: product.price.replace(".", ","),
    },
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

const createPost = [
  validateCreateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [allGames, allPlatforms] = await Promise.all([
        db.games.getAllGames(),
        db.platforms.getAllPlatforms(),
      ]);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: "Novo Produto",
        isEdit: false,
        errors: errors.array(),
        product: req.body,
        allGames,
        allPlatforms,
      });
    }

    const { game_id, platform_id, launch_date, price } = req.body;
    const id = await db.products.createProduct(
      game_id,
      platform_id,
      launch_date,
      price
    );

    res.redirect(`/produto/${id}`);
  },
];

async function updateGet(req, res, next) {
  const product = await db.products.getProduct(req.params.id);

  if (!product) renderErrorPage(res, 404, errorMessage);
  res.render(layoutView, {
    partial: `${viewsDirectory}/form`,
    title: `Editar Produto: ${product.game_title} (${product.platform_name})`,
    isEdit: true,
    errors: [],
    product: {
      ...product,
      launch_date: formatDate.toDateInput(product.launch_date),
    },
  });
}

const updatePost = [
  validateUpdateForm,

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const product = await db.products.getProduct(req.params.id);

      return res.status(400).render(layoutView, {
        partial: `${viewsDirectory}/form`,
        title: `Editar Produto: ${product.game_title} (${product.platform_name})`,
        isEdit: true,
        errors: errors.array(),
        product: {
          id: product.id,
          game_title: product.game_title,
          platform_name: product.platform_name,
          launch_date: req.body.launch_date,
          price: req.body.price,
        },
      });
    }

    const { id, launch_date, price } = req.body;
    await db.products.updateProduct(id, launch_date, price);

    res.redirect(`/produto/${id}`);
  },
];

module.exports = { detailsGet, createGet, createPost, updateGet, updatePost };
