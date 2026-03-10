const cron = require("node-cron");
const Task = require("../models/Task");
const sendEmail = require("../utils/sendEmail");

// ✅ Runs every 15 minutes
cron.schedule("*/15 * * * *", async () => {
    const now = new Date();

    const tasks = await Task.find({
        reminderTime: { $lte: now },
        status: "Pending",  // ✅ stops when task is completed
    }).populate("user");

    for (const task of tasks) {
        await sendEmail(
            task.user.email,
            "Task Reminder - LifeSync",
            `Hi ${task.user.name}! ⏰ Reminder for your task: "${task.title}". Please complete it!`
        );
        console.log("Reminder sent for:", task.title);
    }
});