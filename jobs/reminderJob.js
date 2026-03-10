const cron = require("node-cron");
const Task = require("../models/Task");
const sendEmail = require("../utils/sendEmail");

cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();

        // ✅ Add 5:30 hours to convert UTC to IST
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);

        console.log("⏰ Cron running at UTC:", now.toISOString());
        console.log("⏰ IST time:", istNow.toISOString());

        const tasks = await Task.find({
            reminderTime: { $lte: istNow },
            status: "Pending",
        }).populate("user");

        console.log("📋 Tasks found:", tasks.length);

        for (const task of tasks) {
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