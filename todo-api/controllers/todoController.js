const todoModels = require("../models/todoModel");

function getTodos(req, res) {
  const todos = todoModels.getAllTodos();
  res.json({
    success: true,
    data: todos,
  });
}

function getTodoById(req, res) {
  const todo = todoModels.getTodoById(req.params.id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.json({
    success: true,
    data: todo,
  });
}
function createTodo(req, res) {
  const { title } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required and must be a non-empty string",
    });
  }

  const newTodo = todoModels.createTodo(title);
  res.status(201).json({
    success: true,
    data: newTodo,
  });
}
function updateTodo(req, res) {
  const todo = todoModels.updateTodo(req.params.id, req.body);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.json({
    success: true,
    data: todo,
  });
}
function deleteTodo(req, res) {
  const todo = todoModels.deleteTodo(req.params.id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.json({
    success: true,
    data: todo,
  });
}

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
