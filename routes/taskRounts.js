const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {createTask,getTask,updateTask,deleteTask,searchTask,completeTask,taskStats} = require("../controllers/taskController");


router.post("/",auth,createTask);
router.get("/",auth,getTask);


router.get("/search",auth,searchTask);
router.get("/stats",auth,taskStats);
router.patch("/:id/complete",auth,completeTask);

router.patch("/:id",auth,updateTask);
router.delete("/:id",auth,deleteTask);


module.exports = router;

