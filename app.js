require("dotenv").config({
  path: require("path").join(__dirname, "Backend/.env"),
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDatabase = require("./Backend/config/database");
const authRoutes = require("./Backend/routes/authRoutes");
const todoRoutes = require("./Backend/routes/todoRoutes");
const adminRoutes = require("./Backend/routes/adminRoutes");
const {
  notFound,
  errorHandler,
} = require("./Backend/middleware/errorMiddleware");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const frontendDir = path.join(__dirname, "frontend");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ensureDatabase = async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use(express.static(frontendDir));
app.use("/auth", ensureDatabase);
app.use("/todos", ensureDatabase);
app.use("/admin", ensureDatabase);
app.use(authRoutes);
app.use(todoRoutes);

app.get("/", (_req, res) => res.sendFile(path.join(frontendDir, "login.html")));
app.get("/login", (_req, res) =>
  res.sendFile(path.join(frontendDir, "login.html")),
);
app.get("/register", (_req, res) =>
  res.sendFile(path.join(frontendDir, "register.html")),
);
app.get("/tasks", (_req, res) =>
  res.sendFile(path.join(frontendDir, "index.html")),
);
app.get("/admin", (_req, res) =>
  res.sendFile(path.join(frontendDir, "admin.html")),
);
// Admin API routes
app.use(adminRoutes);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () =>
      console.log(`Server is running at http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) startServer();

module.exports = app;
