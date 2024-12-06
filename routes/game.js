const { Router } = require("express");
const gameController = require("../controllers/game");

const gameRouter = Router();

gameRouter.get("/criar", gameController.createGet);
gameRouter.post("/criar", gameController.createPost);
gameRouter.get("/:id", gameController.detailsGet);

module.exports = gameRouter;
