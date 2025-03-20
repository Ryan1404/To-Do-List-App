// Import modules
const express = require('express');
const task_route = require('./routes/api/task');
const connectDB = require('./db/conn'); // Make sure this connects to MongoDB

// Initialize app
const app = express();

// Connect to DB
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Use the task routes for API
app.use('/api/task/', task_route);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Redirect the root route to index.html
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Start listening on port 8080
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
