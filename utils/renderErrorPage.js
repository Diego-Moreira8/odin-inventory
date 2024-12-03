function renderErrorPage(res, statusCode, message) {
  return res.status(statusCode).render("layouts/layout", {
    partial: `../pages/error`,
    title: "Erro!",
    code: statusCode.toString(),
    message,
  });
}

module.exports = renderErrorPage;
