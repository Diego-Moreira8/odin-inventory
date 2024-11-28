async function homePageGet(req, res, next) {
  res.render("layout", { partial: "home", title: "Início" });
}

module.exports = { homePageGet };
