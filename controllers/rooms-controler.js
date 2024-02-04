const Rooms = require("../models/rooms.js");
const Users = require("../models/user-rooms.js");

const updateMessages = async (req, res) => {
  const room = await Rooms.findById(req.params.id);
  const user = await Users.findById(req.user.id);
  const { messages } = req.body;

  if (!room) return res.status(403).json({ message: "no room found" });

  const authorized = user._id.equals(room.user_id_1) || user._id.equals(room.user_id_2);

  if (!authorized) {
    return res.status(403).json({ message: "user not authorized" });
  }
  const updatedMessages = {
    $push: {
      messages: {
        $each: messages.map(message => ({
          user_id: req.user.id,
          body: message.body
        }))
      }
    }
  };
  
  const response = await Rooms.findByIdAndUpdate(room._id, updatedMessages);
  res.status(200).json({messages: response})

}

const messageRead = async (req, res) => {
  const room = await Rooms.findById(req.params.id);
  const user = await Users.findById(req.user.id);

  if (!room) return res.status(403).json({ message: "no room found" });

  const authorized = user._id.equals(room.user_id_1) || user._id.equals(room.user_id_2);

  if (!authorized) {
    return res.status(403).json({ message: "user not authorized" });
  }

    const readMeesages = {
      messages: {
        $each: room.messages.map(message => ({
          read: message.user_id !== req.user.id ? true : message.read
        }))
      }
  };

  
  const response = await Rooms.findByIdAndUpdate(room._id, readMeesages);
  res.status(200).json({messages: response})

}



const createRoom = async (req, res) => {
  try {
    const { user_id_1, user_id_2 } = req.body;
    const user = await Users.findOne({ _id: req.user.id });

    if (!user_id_1 || !user_id_2) {
      return res.status(400).json({ message: "Didn't get user_1 or user_2 id" });
    }
    if (!(user._id.equals(user_id_1) || user._id.equals(user_id_2))) {
      return res.status(403).json({ message: "User not authorized" });
    }

    const existingRoom = await Rooms.findOne({
      $or: [
        { user_id_1: user_id_1, user_id_2: user_id_2 },
        { user_id_1: user_id_2, user_id_2: user_id_1 },
      ],
    });

    console.log(existingRoom);

    if (!existingRoom) {
      const newRoom = {
        user_id_1: user_id_1,
        user_id_2: user_id_2,
        messages: [],
      };

      const response = await Rooms.create(newRoom);

      if (response) {
        return res.status(201).json({ message: "Room created successfully", room: newRoom });
      }
    } else {
      return res.status(403).json({ message: "Room already exists" });
    }
  } catch (err) {
    console.log("Error creating room", err);
    return res.status(500).json({ messageRead: err.message });
  }
};

module.exports = {
  createRoom,
  updateMessages,
  messageRead,
};
