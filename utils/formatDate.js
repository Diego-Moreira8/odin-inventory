function toBrazilianDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
    new Date(date)
  );
}

function toDateInput(date) {
  const newDate = new Date(date.toString());

  const d = newDate.getDate().toString().padStart(2, "0");
  const m = (newDate.getMonth() + 1).toString().padStart(2, "0");
  const y = newDate.getFullYear().toString().padStart(4, "0");

  return `${y}-${m}-${d}`;
}

module.exports = { toBrazilianDate, toDateInput };
