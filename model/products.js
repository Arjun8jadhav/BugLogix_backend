import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    assignee: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date
    },
    timeLogs: [
        {
            timeSpent: { type: Number, required: true }, // in minutes
            loggedAt: { type: Date, default: Date.now },
            user: { type: String } // optional: log who logged the time
        }
    ]
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
