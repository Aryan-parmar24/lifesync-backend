const express=require("express");
const router=express.Router();
const auth = require("../middleware/authMiddleware");
const {registerUser,loginUser,updateProfile,getProfile}=require("../controllers/authController");

router.post("/register",registerUser);        
router.post("/login",loginUser);
router.patch("/profile", auth, updateProfile); 
router.get("/profile", auth, getProfile); 

module.exports = router;