const cron = require("node-cron");
const Task = require("../models/Task");
const sendEmail = require("../utils/sendEmail");

cron.schedule("*/15 * * * *", async () => {
    try {
        const now = new Date();
        console.log("⏰ Cron UTC now:", now.toISOString());

        // ✅ Only mark missed if deadline was BEFORE today (not today!)
        const startOfToday = new Date(now);
        startOfToday.setUTCHours(0, 0, 0, 0);

        const missedTasks = await Task.find({
            deadline: { $lt: startOfToday }, // strictly before today
            status: "Pending",
        });

        for (const task of missedTasks) {
            await Task.findByIdAndUpdate(task._id, { status: "missed" });
            console.log("❌ Marked as missed:", task.title);
        }

        // Send reminders
        const reminderTasks = await Task.find({
            reminderTime: { $lte: now },
            status: "Pending",
        }).populate("user");

        console.log("📋 Reminder tasks found:", reminderTasks.length);

        for (const task of reminderTasks) {
            try {
                await sendEmail(
                    task.user.email,
                    "Task Reminder - LifeSync ⚡",
                    `Hi ${task.user.name}! ⏰ Reminder for your task: "${task.title}". Please complete it!`
                );
                console.log("✅ Reminder sent for:", task.title);
            } catch (err) {
                console.log("❌ Email error:", err.message);
            }
        }

    } catch (err) {
        console.log("❌ Cron error:", err.message);
    }
});