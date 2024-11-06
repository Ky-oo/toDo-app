const express = require("express");
const router = express.Router();
const { Task, Type } = require("../models");
const { Op } = require("sequelize");

router.get("/", async function (req, res, next) {
  try {
    const title = req.query.title;
    const nbDisplayed = req.query.pagination;
    const pages = req.query.pages || 0;
    const isDone = req.query.isDone;
    const isRetarded = req.query.isRetarded;
    const where = {};

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }
    if (isDone !== undefined) {
      where.done = isDone === 'true';
    }
    if (isRetarded !== undefined) {
      const now = new Date();
      where.dueDate = { [Op.lt]: now };
    }

    const tasks = await Task.findAll({
      where: Object.keys(where).length > 0 ? where : undefined,
      limit: nbDisplayed ? parseInt(nbDisplayed) : undefined,
      offset: pages && nbDisplayed ? pages * parseInt(nbDisplayed) : undefined,
      include: {
        model: Type
      }
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;

  const task = await Task.findByPk(id, {
    include: {
      model: Type
  }});
  if(!task) {
    res.status(404);
    res.json({error: "Task not found"});
  } else {
    res.json(task);
  }
});

router.post("/", async function (req, res, next) {
  
  try {
    const { title, description, dueDate, TypeId } = req.body;
    if (!title || !description || !dueDate || !TypeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const task = await Task.create({
      title: title,
      description: description,
      done: false,
      dueDate: dueDate,
      TypeId: TypeId
    });
    res.status(201);
    res.json(task);
  } catch (error) {
    next(error);
  }

});

router.put("/:id", async function (req, res, next) {
  const id = req.params.id;
  const { title, description, dueDate, done, TypeId } = req.body;
  const task = await Task.findByPk(id);
  if (!task) {
    res.status(404);
    res.json({ error: "Task not found" });
  } else if (!title || !description || !dueDate || !TypeId) {
    res.status(400);
    res.json({ error: "Missing required fields" });
  } else {
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.done = done;
    task.TypeId = TypeId;
    await task.save();
    res.json(task);
  }
});

router.delete('/:id', async function (req, res, next) {
  const id = req.params.id;
  const task = await Task.findByPk(id);
  if (!task) {
    res.status(404);
    res.json({ error: "Task not found" });
  } else {
    await task.destroy();
    res.status(204);
    res.json();
  }
});

router.put('/complete/:id', async function (req, res, next) {
  const id = req.params.id;
  const task = await Task.findByPk(id);
  if (!task) {
    res.status(404);
    res.json({ error: "Task not found" });
  } else {
    task.done = !task.done;
    await task.save();
    res.json(task);
  }
});

module.exports = router;
