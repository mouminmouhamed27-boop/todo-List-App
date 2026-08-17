const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

async function register({ name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail }).lean();

  if (exists) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashed, role: "user" });
  const token = signToken(user);

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken: token,
  };
}

async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await comparePassword(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken: signToken(user),
  };
}

module.exports = { register, login };
