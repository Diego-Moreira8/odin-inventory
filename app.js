// Modules
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

// Routes
const indexRouter = require("./routes/index");
const developersRouter = require("./routes/developers");
const developerRouter = require("./routes/developer");
const genresRouter = require("./routes/genres");
const genreRouter = require("./routes/genre");
const platformsRouter = require("./routes/platforms");
const platformRouter = require("./routes/platform");

const PORT = 3000;
const app = express();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up Helmet
app.use(helmet({ contentSecurityPolicy: false }));
// Set up logger
app.use(morgan("dev"));
// To get data from forms
app.use(express.urlencoded({ extended: true }));
// Static files
app.use(express.static(path.join(__dirname, "public")));

// Add routes
app.use("/", indexRouter);
app.use("/desenvolvedores", developersRouter);
app.use("/desenvolvedor", developerRouter);
app.use("/generos", genresRouter);
app.use("/genero", genreRouter);
app.use("/plataformas", platformsRouter);
app.use("/plataforma", platformRouter);

app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);
