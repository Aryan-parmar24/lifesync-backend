const cron = require("node-cron");
const Task = require("../models/Task");
const sendEmail = require("../utils/sendEmail");

cron.schedule("* * * * *", async () => {
    try {
        const now = new Date(); // pure UTC
        console.log("⏰ Cron UTC now:", now.toISOString());

        const tasks = await Task.find({
            reminderTime: { $lte: now }, // ✅ compare UTC vs UTC
            status: "Pending",
        }).populate("user");

        console.log("📋 Tasks found:", tasks.length);

        for (const task of tasks) {
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