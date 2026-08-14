const todos = [
  {
    id: 1,
    title: "Learn Node.js",
    completed: false,
  },
  {
    id: 2,
    title: "Learn Express",
    completed: false,
  },
  {
    id: 3,
    title: "learn Nest ",
    completed: false,
  },
];

function getAllTodos() {
  return todos;
}

function getTodoById(id) {
  return todos.find((todo) => todo.id === Number(id));
}
function createTodo(title) {
  const newTodo = {
    id: todos.length ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1,
    title: title,
    completed: false,
  };

  todos.push(newTodo);
  return newTodo;
}

function updateTodo(id, data) {
  const todo = todos.find((todo) => todo.id === Number(id));

  if (!todo) {
    return null;
  }

  if (data.title !== undefined) {
    todo.title = data.title;
  }

  if (data.completed !== undefined) {
    todo.completed = data.completed;
  }

  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return null;
  }

  const deletedTodo = todos.splice(index, 1);

  return deletedTodo[0];
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
