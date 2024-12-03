const { Router } = require("express");
const platformsController = require("../controllers/platforms");

const platformsRouter = Router();

platformsRouter.get("/", platformsController.listAllGet);

module.exports = platformsRouter;
