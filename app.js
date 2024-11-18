const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const writeLog = require('./middleware/logger');
const dotenv = require("dotenv");
dotenv.config();

require("./models");

const indexRouter = require("./routes/index");
const legacyTaskRouter = require("./routes/legacy_task");
const taskRouter = require("./routes/task");
const typeRouter = require("./routes/type");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    writeLog(req, res);
  });
  next();
});

//rooter
app.use("/", indexRouter);
app.use("/task", taskRouter);
app.use("/legacy/task", legacyTaskRouter);
app.use("/type", typeRouter);

module.exports = app;