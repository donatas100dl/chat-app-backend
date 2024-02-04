const mongoose = require("mongoose");


const messagesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    }
})


const roomsSchema = new mongoose.Schema({
  user_id_1: {
    type: String,
    required: true,

  },
  user_id_2: {
    type: String,
    required: true,
  },
  messages: [messagesSchema]
});
module.exports = mongoose.model("room2", roomsSchema);
