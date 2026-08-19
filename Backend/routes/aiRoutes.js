const express = require("express");
const aiController = require("../controllers/aiController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use("/ai", requireAuth);

router.post("/ai/chat", aiController.askAI);

module.exports = router;
