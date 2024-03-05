const {
  registerUser,
  login,
  getCurrentUser,
  getAllUsers,
  getAllUsersRooms,
  checkEmailTaken,
  checkUsernameTaken,
  verifyEmail,
  sendVerifyEmail,
} = require("../controllers/user-controller");
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {attachTransporter} = require("../middleware/transporter");

router.post("/", attachTransporter, registerUser);
router.post("/login", login);
router.get("/", protect, getCurrentUser);
router.get("/chats", protect, getAllUsersRooms);
router.get("/all", getAllUsers)
router.post("/exist/email", checkEmailTaken)
router.post("/exist/username", checkUsernameTaken)
router.get("/verify/:token", verifyEmail)
router.post("/verify/email", attachTransporter , sendVerifyEmail )

module.exports = router;
