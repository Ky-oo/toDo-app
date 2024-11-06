const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

require("./models");

const indexRouter = require("./routes/index");
const legacyTaskRouter = require("./routes/legacy_task");
const taskRouter = require("./routes/task");
const typeRouter = require("./routes/type");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/task", taskRouter);
app.use("/legacy/task", legacyTaskRouter);
app.use("/type", typeRouter);

module.exports = app;
