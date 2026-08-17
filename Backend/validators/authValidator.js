const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isString().isLength({ min: 8, max: 128 }).withMessage("Password must be 8-128 characters"),
];

const loginValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

module.exports = { registerValidator, loginValidator };
