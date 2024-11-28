const express = require("express");
const indexRouter = require("./routes/index");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

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

app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);
