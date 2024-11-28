// Modules
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

// Routes
const indexRouter = require("./routes/index");
const developersRouter = require("./routes/developers");

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
app.use("/desenvolvedor", developersRouter);

app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);
