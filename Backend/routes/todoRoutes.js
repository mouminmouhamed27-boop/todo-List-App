const express = require("express");
const todoController = require("../controllers/todoController");
const requireAuth = require("../middleware/authMiddleware");
const { createTaskValidator, updateTaskValidator } = require("../validators/taskValidator");

const router = express.Router();
router.use("/todos", requireAuth);
router.get("/todos", todoController.getTodos);
router.get("/todos/:id", todoController.getTodoById);
router.post("/todos", createTaskValidator, todoController.createTodo);
router.patch("/todos/:id", updateTaskValidator, todoController.updateTodo);
router.delete("/todos/:id", todoController.deleteTodo);

module.exports = router;
