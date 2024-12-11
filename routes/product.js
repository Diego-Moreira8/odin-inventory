const { Router } = require("express");
const productController = require("../controllers/product");

const productRouter = Router();

productRouter.get("/criar", productController.createGet);
productRouter.post("/criar", productController.createPost);
productRouter.get("/:id", productController.detailsGet);

module.exports = productRouter;
