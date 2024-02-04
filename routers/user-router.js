const {
  registerUser,
  login,
  getCurrentUser,
  getAllUsers,
  getAllUsersRooms,
  checkEmailTaken,
  checkUsernameTaken,
} = require("../controllers/user-controller");
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", login);
router.get("/", protect, getCurrentUser);
router.get("/chats", protect, getAllUsersRooms);
router.get("/all", getAllUsers)
router.post("/exist/email", checkEmailTaken)
router.post("/exist/username", checkUsernameTaken)


module.exports = router;
