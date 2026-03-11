const cron = require("node-cron");
const Task = require("../models/Task");
const sendEmail = require("../utils/sendEmail");

cron.schedule("*/15 * * * *", async () => {
    try {
        const now = new Date();
        console.log("⏰ Cron UTC now:", now.toISOString());

        // ✅ Auto mark missed tasks — deadline passed + still Pending
        const missedTasks = await Task.find({
            deadline: { $lt: now },
            status: "Pending",
        });

        for (const task of missedTasks) {
            await Task.findByIdAndUpdate(task._id, { status: "missed" });
            console.log("❌ Marked as missed:", task.title);
        }

        if (missedTasks.length > 0) {
            console.log(`📌 ${missedTasks.length} tasks marked as missed`);
        }

        // ✅ Send reminders for pending tasks whose reminderTime has passed
        const reminderTasks = await Task.find({
            reminderTime: { $lte: now },
            status: "Pending",
        }).populate("user");

        console.log("📋 Reminder tasks found:", reminderTasks.length);

        for (const task of reminderTasks) {
            console.log("🔍 Task reminder time:", task.reminderTime);
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