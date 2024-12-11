const { Router } = require("express");
const productsController = require("../controllers/products");

const productsRouter = Router();

productsRouter.get("/", productsController.listAllGet);

module.exports = productsRouter;
