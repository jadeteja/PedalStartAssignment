const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let tasks = []; // In-memory storage for tasks

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { title, desc, date } = req.body;
    if (title && desc && date) {
        const newTask = { id: tasks.length + 1, title, desc, date };
        tasks.push(newTask);
        res.status(201).json(newTask);
    } else {
        res.status(400).json({ error: 'Please provide title, description, and date' });
    }
});

// Edit a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, desc, date } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

    if (taskIndex !== -1) {
        tasks[taskIndex] = { id: parseInt(id), title, desc, date };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1);
        res.json(deletedTask[0]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
