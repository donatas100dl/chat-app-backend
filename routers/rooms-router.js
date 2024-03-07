const { protect } = require("../middleware/authMiddleware");
const { updateMessages,createRoom, messageRead, unreadMessages } = require("../controllers/rooms-controler");
const express = require("express");
const router = express.Router();

router.post("/new", protect, createRoom)
router.put("/update/:id", protect, updateMessages);
router.put("/read/messages/:id", protect, messageRead)
router.put("/unreadMessages/:id", protect, unreadMessages)
module.exports = router;
