const express = require("express");
const sql = require("./db.js");
const router = express.Router();
const { Type } = require("../models");


/* GET all type page. */
router.get("/", function (req, res, next) {
  const types = Type.findAll()
  res.json(types);
});

/* GET one type page. */
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  const type = Type.findByPk(id)
  if (!type) {
    res.status(404);
    res.json({ error: "Type not found" });
  } else {  
    res.json(type);
  }
});

/* Post type page. */
router.post("/", function (req, res, next) {
  const title = req.body.title;
  if (!title) {
    res.status(400);
    res.json({ error: "Missing required fields" });
  } else {
    const type = Type.create({
      title: title
    });
    res.status(201);
    res.json(type);
  }
});

module.exports = router;
