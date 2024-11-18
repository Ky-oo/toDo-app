const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const writeLog = require('./middleware/logger');
const verifyToken = require('./middleware/verify_jwt_token');
const dotenv = require("dotenv");
dotenv.config();

require("./models");

const indexRouter = require("./routes/index");
const legacyTaskRouter = require("./routes/legacy_task");
const taskRouter = require("./routes/task");
const typeRouter = require("./routes/type");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);

//middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    writeLog(req, res);
  });
  next();
});

app.use(verifyToken)

//rooter
app.use("/", indexRouter);
app.use("/task", taskRouter);
app.use("/legacy/task", legacyTaskRouter);
app.use("/type", typeRouter);

module.exports = app;