require("dotenv").config();
const https = require("https");
const RENDER_URL = "https://lifesync-backend-mm9r.onrender.com";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const authRoutes=require("./routes/authRoutes");
const taskRoutes=require("./routes/taskRounts");
const helmet=require("helmet");
const rateLimit=require("express-rate-limit");
const errorHandler=require("./middleware/errorHandler");

require("dotenv").config();

const app=express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://lifesync-frontend-nu.vercel.app",
    ],
    credentials: true,
}));
setInterval(() => {
    https.get(RENDER_URL, (res) => {
        console.log("✅ Keep alive ping:", res.statusCode);
    }).on("error", (err) => {
        console.log("❌ Ping error:", err.message);
    });
}, 14 * 60 * 1000);
app.use(express.json());
//this prevents API abuse
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
app.use(errorHandler);

app.get("/",(req,res)=>{
    res.send("LifeSync is Running.....");
});
require("./jobs/reminderJob");
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("monogoDB is connected"))
    .catch(err=>console.log(err));

const PORT=process.env.PORT || 5000;

//all routes calles here
app.use("/api/auth",authRoutes);
app.use("/api/task",taskRoutes);
require("./jobs/reminderJob");

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});
