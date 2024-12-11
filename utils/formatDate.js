function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
    new Date(date)
  );
}

module.exports = formatDate;
