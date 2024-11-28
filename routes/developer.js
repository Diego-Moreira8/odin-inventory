const { Router } = require("express");
const developerController = require("../controllers/developer");

const developerRouter = Router();

developerRouter.get("/criar", developerController.createGet);
developerRouter.post("/criar", developerController.createPost);

module.exports = developerRouter;
