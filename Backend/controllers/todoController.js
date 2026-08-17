const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const taskService = require("../services/taskService");

function invalidId(id) {
  return !mongoose.Types.ObjectId.isValid(id);
}

async function getTodos(req, res, next) {
  try {
    const todos = await taskService.getAll(req.user.id);
    res.json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
}

async function getTodoById(req, res, next) {
  try {
    if (invalidId(req.params.id)) return res.status(404).json({ success: false, message: "Todo not found" });
    const todo = await taskService.getById(req.user.id, req.params.id);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
}

async function createTodo(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
    const todo = await taskService.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
}

async function updateTodo(req, res, next) {
  try {
    if (invalidId(req.params.id)) return res.status(404).json({ success: false, message: "Todo not found" });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });

    const allowed = {};
    if (req.body.title !== undefined) allowed.title = req.body.title;
    if (req.body.description !== undefined) allowed.description = req.body.description;
    if (req.body.completed !== undefined) allowed.completed = req.body.completed;

    if (!Object.keys(allowed).length) return res.status(400).json({ success: false, message: "No valid fields to update" });

    const todo = await taskService.update(req.user.id, req.params.id, allowed);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
}

async function deleteTodo(req, res, next) {
  try {
    if (invalidId(req.params.id)) return res.status(404).json({ success: false, message: "Todo not found" });
    const todo = await taskService.remove(req.user.id, req.params.id);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
}

module.exports = { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };
