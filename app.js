//dependencies
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//establish env connection mongodb
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MONGODB CONNECTED");
  })
  .catch((e) => {
    console.log(e);
  });

//routes section

var userRouter = require("./routes/user/userRouter");
var postRouter = require("./routes/post/postRouter");
var commentRouter = require("./routes/comment/commentRouter");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//router Paths
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: "error", error: err.message });
});

module.exports = app;
