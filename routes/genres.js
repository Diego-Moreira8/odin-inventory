const { Router } = require("express");
const genresController = require("../controllers/genres");

const genresRouter = Router();

genresRouter.get("/", genresController.listAllGet);

module.exports = genresRouter;
