const Task = require("../models/Task");

//create task
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user });
        res.status(201).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "server Error" });
    }
};

//get all the task for user

exports.getTask = async (req, res) => {
    try {
        const query = { user: req.user };
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.priority) {
            query.priority = req.query.priority;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const sort = req.query.sort || "-createdAt";

        const tasks = await Task.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
    }
};

//update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            { _id: req.params.id, user: req.user },
            req.body,
            { new: true }
        );
        if (!task)
            return res.status(400).json({ msg: "Task Not Found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

//delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user
        });
        if (!task)
            return res.status(404).json({ msg: "Task Not Found" });
        res.json({ msg: "Task is Deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};
exports.searchTask = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user,
            title: { $regex: req.query.q, $options: "i" }
        });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            { _id: req.params.id, user: req.user },
            { status: "completed" },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ msg: "task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: "server error" });
    }
};

exports.taskStats = async (req, res) => {
    try {
        const total = await Task.countDocuments({ user: req.user });

        const completed = await Task.countDocuments({ user: req.user, status: { $regex: "^completed$", $options: "i" } });

        const pending = await Task.countDocuments({ user: req.user, status: { $regex: "^pending$", $options: "i" } });

        const missed = await Task.countDocuments({ user: req.user, status: { $regex: "^missed$", $options: "i" } });

        res.json({
            total,
            completed,
            pending,
            missed
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};