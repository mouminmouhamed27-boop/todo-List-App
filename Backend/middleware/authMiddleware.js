const User = require("../models/userModel");
const { verifyToken } = require("../utils/jwt");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
