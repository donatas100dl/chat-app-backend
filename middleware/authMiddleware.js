const jwt = require("jsonwebtoken");
const User = require("../models/user-rooms.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
      // get user form token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.log(err + " middleware");
      res.status(401).json({ message: err.message });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Unauthorized, no token" });
  }
};

module.exports = { protect };
