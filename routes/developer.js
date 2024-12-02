const { Router } = require("express");
const developerController = require("../controllers/developer");

const developerRouter = Router();

developerRouter.get("/criar", developerController.createGet);
developerRouter.post("/criar", developerController.createPost);
developerRouter.get("/:id/editar", developerController.updateGet);
developerRouter.post("/:id/editar", developerController.updatePost);
developerRouter.get("/:id", developerController.detailsGet);

module.exports = developerRouter;
