const express = require("express");
const cors = require("cors");
const todoRoutes = require("./todo-api/routes/todoRoutes");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use(todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
