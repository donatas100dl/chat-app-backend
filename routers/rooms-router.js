const { protect } = require("../middleware/authMiddleware");
const { updateMessages,createRoom } = require("../controllers/rooms-controler");
const express = require("express");
const router = express.Router();

router.post("/new", protect, createRoom)
router.put("/update/:id", protect, updateMessages);
module.exports = router;
