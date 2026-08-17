const mongoose = require("mongoose");
const User = require("../models/userModel");
const Todo = require("../models/todoModel");

function formatUser(user, numberOfTasks) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    numberOfTasks: numberOfTasks || 0,
  };
}

async function listUsers({ search } = {}) {
  const filter = {};

  if (search && search.trim()) {
    const term = search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  // Users are never fetched with the password field (select: false on the model
  // already excludes it by default; we never call .select("+password") here).
  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  const userIds = users.map((u) => u._id);

  const counts = await Todo.aggregate([
    { $match: { userId: { $in: userIds } } },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

  return users.map((u) => formatUser(u, countMap.get(u._id.toString())));
}

async function getUserById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const user = await User.findById(id).lean();
  if (!user) return null;

  const numberOfTasks = await Todo.countDocuments({ userId: user._id });
  return formatUser(user, numberOfTasks);
}

async function listTasks() {
  const todos = await Todo.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();

  return todos.map((t) => ({
    id: t._id.toString(),
    title: t.title,
    description: t.description,
    completed: t.completed,
    createdAt: t.createdAt,
    owner: t.userId
      ? { id: t.userId._id.toString(), name: t.userId.name, email: t.userId.email }
      : null,
  }));
}

async function getStats() {
  const [totalUsers, totalTasks, completedTasks, totalAdmins] = await Promise.all([
    User.countDocuments({}),
    Todo.countDocuments({}),
    Todo.countDocuments({ completed: true }),
    User.countDocuments({ role: "admin" }),
  ]);

  return {
    totalUsers,
    totalTasks,
    completedTasks,
    pendingTasks: totalTasks - completedTasks,
    totalAdmins,
  };
}

async function updateUserRole(actingAdminId, targetUserId, newRole) {
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!["user", "admin"].includes(newRole)) {
    const error = new Error("Role must be 'user' or 'admin'");
    error.statusCode = 400;
    throw error;
  }

  // Safety: prevent an admin from demoting themselves, which could lock
  // everyone out of the admin dashboard if they are the only admin.
  if (actingAdminId === targetUserId && newRole !== "admin") {
    const error = new Error("You cannot remove your own admin role");
    error.statusCode = 400;
    throw error;
  }

  const target = await User.findById(targetUserId);
  if (!target) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Safety: prevent demoting the last remaining admin in the system.
  if (target.role === "admin" && newRole === "user") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      const error = new Error("Cannot demote the only remaining admin");
      error.statusCode = 400;
      throw error;
    }
  }

  target.role = newRole;
  await target.save();

  const numberOfTasks = await Todo.countDocuments({ userId: target._id });
  return formatUser(target, numberOfTasks);
}

async function deleteUser(actingAdminId, targetUserId) {
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (actingAdminId === targetUserId) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const target = await User.findById(targetUserId);
  if (!target) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (target.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      const error = new Error("Cannot delete the only remaining admin");
      error.statusCode = 400;
      throw error;
    }
  }

  // Clean up related data: delete the user's todos along with the account.
  await Todo.deleteMany({ userId: target._id });
  await User.deleteOne({ _id: target._id });

  return { id: target._id.toString() };
}

module.exports = {
  listUsers,
  getUserById,
  listTasks,
  getStats,
  updateUserRole,
  deleteUser,
};
