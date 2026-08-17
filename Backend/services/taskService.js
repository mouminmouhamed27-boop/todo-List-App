const Todo = require("../models/todoModel");

function formatTodo(todo) {
  if (!todo) return null;

  const data = todo.toObject ? todo.toObject() : todo;

  return {
    ...data,
    id: data._id.toString(),
  };
}

async function getAll(userId) {
  const todos = await Todo.find({ userId }).sort({ createdAt: -1 }).lean();

  return todos.map(formatTodo);
}

async function getById(userId, id) {
  const todo = await Todo.findOne({
    _id: id,
    userId,
  }).lean();

  return formatTodo(todo);
}

async function create(userId, data) {
  const todo = await Todo.create({
    userId,
    title: data.title,
    description: data.description || "",
    completed: false,
  });

  return formatTodo(todo);
}

async function update(userId, id, data) {
  const todo = await Todo.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return formatTodo(todo);
}

async function remove(userId, id) {
  const todo = await Todo.findOneAndDelete({
    _id: id,
    userId,
  });

  return formatTodo(todo);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
