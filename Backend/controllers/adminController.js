const { validationResult } = require("express-validator");
const adminService = require("../services/adminService");

async function getUsers(req, res, next) {
  try {
    const users = await adminService.listUsers({ search: req.query.search });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await adminService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
    }

    const user = await adminService.updateUserRole(req.user.id, req.params.id, req.body.role);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const result = await adminService.deleteUser(req.user.id, req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getTasks(req, res, next) {
  try {
    const tasks = await adminService.listTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await adminService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, getUserById, updateUserRole, deleteUser, getTasks, getStats };
