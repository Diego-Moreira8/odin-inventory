const { Router } = require("express");
const developersController = require("../controllers/developers");

const developersRouter = Router();

developersRouter.get("/", developersController.listAllGet);

module.exports = developersRouter;
