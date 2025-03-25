const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "1234", // Your MySQL password
  database: "todo_db", // Database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// Get all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
    res.json(result);
  });
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { text } = req.body;
  const newTask = { text, completed: false };

  db.query("INSERT INTO tasks SET ?", newTask, (err, result) => {
    if (err) {
      console.error("Error adding task:", err);
      return res.status(500).json({ error: "Failed to add task" });
    }
    res.json({ ...newTask, id: result.insertId });
  });
});

// Update task completion status
app.put("/tasks/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  db.query("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Failed to update task" });
    }
    res.json({ id, completed });
  });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tasks WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Failed to delete task" });
    }
    res.json({ message: "Task deleted" });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
