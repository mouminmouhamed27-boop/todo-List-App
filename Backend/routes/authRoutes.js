const express = require("express");
const authController = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidator");

const router = express.Router();
router.post("/auth/register", registerValidator, authController.register);
router.post("/auth/login", loginValidator, authController.login);

module.exports = router;
