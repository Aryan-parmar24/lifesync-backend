const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
   const authHeader = req.header("Authorization");

   if(!authHeader){
      return res.status(401).json({msg:"No token"});
   }

   if(!authHeader.startsWith("Bearer ")){
      return res.status(401).json({msg:"Token format wrong"});
   }

   const token = authHeader.split(" ")[1];

   try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
   }catch(err){
      res.status(401).json({msg:"Token invalid"});
   }
};