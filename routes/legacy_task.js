const express = require("express");
const sql = require("./db.js");
const router = express.Router();

class OverflowPage extends Error {
  constructor(message) {
    super(message);
    this.name = "OverflowPage";
  }
}

/* GET all task page. */
router.get("/", async function (req, res, next) {
  const title = req.query.title;
  const nbDiplayed = req.query.pagination;
  const pages = req.query.pages || 0;
  const isDone = req.query.isDone;
  const isRetarded = req.query.isRetarded;
  const where = [];

  let nbTask;
  let query = "select * from task";

  if (title) {
    where.push(`title like '%${title}%'`);
  }
  if (nbDiplayed) {
    try {
      const response = await sql.query("select count(id) from task");
      nbTask = response[0]["count(id)"];

      if (pages < 0 || pages > nbTask / nbDiplayed) {
        throw new OverflowPage();
      } else {
        query += ` limit ${nbDiplayed} offset ${pages * nbDiplayed}`;
      }
    } catch (error) {
      if (error instanceof OverflowPage) {
        res.status(400);
        res.json({ error: "page number is not valid" });
      } else {
        res.status(400);
        res.json(error);
      }
      return;
    }
  }
  if (isDone) {
    where.push(`done = ${isDone}`);
  }
  if (isRetarded) {
    where.push(`dueDate < now()`);
  }
  if (where.length > 0) {
    query += ` where ${where.join(" and ")}`;
  }

  sql
    .query(query)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400);
      res.json(error);
    });
});

/* GET one task page. */
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  sql
    .query(`select * from task where task.id = ${id}`)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400);
      res.json(error);
    });
});

/* Complete one task page. */
router.put("/complete/:id", function (req, res, next) {
  const id = req.params.id;
  sql
    .query(`select * from task where task.id = ${id}`)
    .then((response) => {
      let task = response[0];
      task.done = !task.done;
      sql
        .query(`update task set done = ${task.done} where task.id = ${task.id}`)
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          res.status(400);
          res.json(error);
        });
    })
    .catch((error) => {
      res.status(400);
      res.json(error);
    });
});

/* Post task page. */
router.post("/", function (req, res, next) {
  const title = req.body.title;
  const description = req.body.description;
  const done = false;
  const dueDate = req.body.dueDate;
  const type = req.body.type;

  sql
    .query(
      `
      insert into task (title, description, done, dueDate, type) 
      values ('${title}', '${description}', ${done}, '${dueDate}' ${type})
      `
    )
    .then((response) => {
      sql
        .query(`select * from task where task.id = ${response.insertId}`)
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          res.status(400);
          res.json(error);
        });
    })
    .catch((error) => {
      res.status(400);
      res.json(error);
    });
});

/* Update task page. */
router.put("/id", function (req, res, next) {});

/* delete task page. */
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  console.log(id);
  sql
    .query(`delete from task where task.id = ${id}`)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400);
      res.json(error);
    });
});

module.exports = router;
