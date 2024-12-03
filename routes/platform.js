const { Router } = require("express");
const platformController = require("../controllers/platform");

const platformRouter = Router();

platformRouter.get("/criar", platformController.createGet);
platformRouter.post("/criar", platformController.createPost);
platformRouter.get("/:id/editar", platformController.updateGet);
platformRouter.post("/:id/editar", platformController.updatePost);
platformRouter.get("/:id/apagar", platformController.deleteGet);
platformRouter.post("/:id/apagar", platformController.deletePost);
platformRouter.get("/:id", platformController.detailsGet);

module.exports = platformRouter;
