import express from "express";
import connectdb from "./db/connect.js";
import Task from "./model/products.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // This will parse incoming JSON requests

// Connect to MongoDB once at startup, not on every request
connectdb();

app.get('/', (req, res) => {
    res.status(200).json({ message: "hello1" });
});

app.post('/create', async (req, res) => {
    try {
        const { title, description, priority, status, assignee, dueDate } = req.body;
        const newTask = new Task({
            title,
            description,
            priority,
            status,
            assignee,
            dueDate
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Failed to create task", error });
    }
});
app.get('/tasks', async (req, res) => {
    try {
        const { page = 1, limit = 10, priority, status } = req.query;
        const startIndex = (page - 1) * limit;
        
        
        let filter = {};
        if (priority) filter.priority = priority;
        if (status) filter.status = status;

        
        const tasks = await Task.find(filter)
            .skip(startIndex)
            .limit(parseInt(limit))
            .sort({ priority: 1 });

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Failed to fetch tasks", error });
    }
});
app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Failed to fetch task", error });
    }
});

// Delete a specific task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Failed to delete task", error });
    }
});
// Update a specific task by ID
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, assignee, dueDate } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, {
            title,
            description,
            priority,
            status,
            assignee,
            dueDate
        }, { new: true }); 

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Failed to update task", error });
    }
});


app.listen(8800, () => {
    console.log("Server started on port 8800");
});
