const express = require("express");
const router = express.Router();

/* GET all task page. */
router.get("/", function (req, res, next) {
  res.json({ message: "Hello world" });
});

module.exports = router;
 