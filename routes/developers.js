const { Router } = require("express");
const developersController = require("../controllers/developers");

const developersRouter = Router();

developersRouter.get("/", developersController.listAllGet);
developersRouter.get("/criar", developersController.createGet);
developersRouter.post("/criar", developersController.createPost);

module.exports = developersRouter;
