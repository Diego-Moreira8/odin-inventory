const { Router } = require("express");
const genreController = require("../controllers/genre");

const genreRouter = Router();

genreRouter.get("/criar", genreController.createGet);
genreRouter.post("/criar", genreController.createPost);
genreRouter.get("/:id/editar", genreController.updateGet);
genreRouter.post("/:id/editar", genreController.updatePost);
genreRouter.get("/:id/apagar", genreController.deleteGet);
genreRouter.post("/:id/apagar", genreController.deletePost);
genreRouter.get("/:id", genreController.detailsGet);

module.exports = genreRouter;
