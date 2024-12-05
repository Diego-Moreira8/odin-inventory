const { Router } = require("express");
const gamesController = require("../controllers/games");

const gamesRouter = Router();

gamesRouter.get("/", gamesController.listGet);

module.exports = gamesRouter;
