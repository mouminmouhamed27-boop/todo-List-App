const { body } = require("express-validator");

const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
  body("description").optional().isString().withMessage("Description must be a string").isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
];

const updateTaskValidator = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
  body("description").optional().isString().withMessage("Description must be a string").isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
  body("completed").optional().isBoolean().withMessage("Completed must be boolean").toBoolean(),
];

module.exports = { createTaskValidator, updateTaskValidator };
