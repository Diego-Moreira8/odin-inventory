const { Router } = require("express");
const db = require("../db/queries");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.send("Hello!");
});

// Create Dev
indexRouter.get("/desenvolvedor/criar", (req, res) => {
  res.render("createDev");
});

indexRouter.post("/desenvolvedor/criar", async (req, res) => {
  await db.addDeveloper(req.body.developer);
  res.send(req.body.developer);
});

module.exports = indexRouter;
