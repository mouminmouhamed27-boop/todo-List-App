const express = require("express");
const adminController = require("../controllers/adminController");
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { updateRoleValidator } = require("../validators/adminValidator");

const router = express.Router();

router.use("/admin", requireAuth, requireAdmin);

router.get("/admin/stats", adminController.getStats);
router.get("/admin/users", adminController.getUsers);
router.get("/admin/users/:id", adminController.getUserById);
router.patch("/admin/users/:id/role", updateRoleValidator, adminController.updateUserRole);
router.delete("/admin/users/:id", adminController.deleteUser);
router.get("/admin/tasks", adminController.getTasks);

module.exports = router;
