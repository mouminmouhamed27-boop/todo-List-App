/**
 * Safe CLI bootstrap for creating/promoting an admin user.
 * This is NOT an HTTP route — it never gets exposed publicly, so it can't
 * be used by a normal user to grant themselves admin access.
 *
 * Usage (run from the project root):
 *   node Backend/scripts/createAdmin.js --email admin@example.com --password "StrongPass123" --name "Admin"
 *
 * If a user with that email already exists, the script promotes them to
 * admin instead of creating a duplicate account (password is left as-is
 * unless --password is provided AND you pass --force-password).
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDatabase = require("../config/database");
const User = require("../models/userModel");
const { hashPassword } = require("../utils/password");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      args[key] = value;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const email = (args.email || "").toLowerCase().trim();
  const password = args.password;
  const name = args.name || "Admin";
  const forcePassword = Boolean(args["force-password"]);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("✖ Provide a valid --email");
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error("✖ Provide a --password with at least 8 characters");
    process.exit(1);
  }

  await connectDatabase();

  let user = await User.findOne({ email }).select("+password");

  if (user) {
    if (user.role === "admin") {
      console.log(`ℹ ${email} is already an admin. Nothing to do.`);
    } else {
      user.role = "admin";
      if (forcePassword) user.password = await hashPassword(password);
      await user.save();
      console.log(`✔ Promoted existing user ${email} to admin.`);
    }
  } else {
    const hashed = await hashPassword(password);
    user = await User.create({ name, email, password: hashed, role: "admin" });
    console.log(`✔ Created new admin user: ${email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
}

main().catch((error) => {
  console.error("✖ Failed to create admin:", error.message);
  process.exit(1);
});
