const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../tasks.json');

// Helper to read tasks
const readTasks = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        return JSON.parse(fs.readFileSync(DATA_FILE));
    } catch (err) {
        console.error("Error reading tasks:", err);
        return [];
    }
};

// Helper to write tasks
const saveTasks = (tasks) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
        return true;
    } catch (err) {
        console.error("Error saving tasks:", err);
        return false;
    }
};

// GET /api/tasks - Get all tasks
router.get('/', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// POST /api/tasks - Add a task
router.post('/', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let tasks = readTasks();

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Task not found' });

    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
    res.json(tasks[index]);
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let tasks = readTasks();

    const newTasks = tasks.filter(t => t.id !== id);
    saveTasks(newTasks);
    res.json({ success: true });
});

// POST /api/tasks/reorder - Reorder tasks
router.post('/reorder', (req, res) => {
    const { tasks } = req.body;
    if (Array.isArray(tasks)) {
        saveTasks(tasks);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid data' });
    }
});

module.exports = router;
