const db = require("../db/allQueries");

async function listAllGet(req, res, next) {
  const allProducts = await db.products.getAllProducts();

  res.render("layouts/layout", {
    partial: "../pages/products/list",
    title: "Todas os Produtos",
    allProducts,
  });
}

module.exports = { listAllGet };
