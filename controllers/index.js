async function homePageGet(req, res, next) {
  res.render("layouts/layout", { partial: "../pages/home", title: "Início" });
}

module.exports = { homePageGet };
