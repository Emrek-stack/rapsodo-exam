var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressHbs = require("express-handlebars");
var mongoose = require("mongoose");
var _ = require("lodash");
var chalk = require("chalk");
var bodyParser = require("body-parser");

var homeRouter = require("./routes/homeRoute");
var usersRouter = require("./routes/userRoute");
var postRouter = require("./routes/postRoute");

var app = express();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(
    process.env.MONGOHQ_URL ||
      process.env.MONGODB_URI ||
      "mongodb://" +
        (process.env.LOCALHOST_27017_TCP_ADDR || "localhost") +
        "/rapsodo"
  )
  .then(function(connection) {
    // Enabling mongoose debug mode if required
    mongoose.set("debug", true);

    // // Call callback FN
    // if (callback) callback(connection.db);
  })
  .catch(function(err) {
    console.error(chalk.red("Could not connect to MongoDB!"));
    console.log(err);
  });

//session
var store = new MongoDBStore({
  uri: "mongodb://localhost:27017/rapsodo",
  collection: "session"
});

app.use(
  session({
    secret: "sessionsecret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", expressHbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use("/", homeRouter);
app.use("/user", usersRouter);
app.use("/post", postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
