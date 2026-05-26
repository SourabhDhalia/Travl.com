const express = require("express");
const session = require("express-session");
const path = require("path");
const expressHandlebars = require("express-handlebars");

const env = require("./config/env");
const paths = require("./config/paths");
const { connectDatabase } = require("./config/database");
const { attachViewLocals } = require("./middleware/viewLocals");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { json } = require("./utils/viewHelpers");

const apiRoutes = require("./routes/apiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();
const handlebarsEngine = expressHandlebars.engine || expressHandlebars;
let MongoStore = null;

try {
  MongoStore = require("connect-mongo");
} catch (error) {
  MongoStore = null;
}

app.disable("x-powered-by");

app.engine(
  "hbs",
  handlebarsEngine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(paths.templates, "layouts"),
    partialsDir: paths.partials,
    helpers: {
      json,
      eq: (left, right) => left === right,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", paths.views);
app.set("trust proxy", 1);

app.use(express.static(paths.public, { maxAge: env.isProduction ? "7d" : 0 }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(express.json({ limit: "100kb" }));

app.use(async (req, res, next) => {
  await connectDatabase();
  next();
});

app.use(
  session({
    name: "travl.sid",
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: env.mongoUri && MongoStore
      ? MongoStore.create({
          mongoUrl: env.mongoUri,
          collectionName: "sessions",
          ttl: 60 * 60 * 24 * 7,
        })
      : undefined,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(attachViewLocals);

app.use("/api", apiRoutes);
app.use(adminRoutes);
app.use(authRoutes);
app.use(pageRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
