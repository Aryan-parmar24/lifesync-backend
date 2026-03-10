const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json("No token");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("Token format wrong");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json("Invalid token");
  }
};