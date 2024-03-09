const Rooms = require("../models/rooms.js");
const Users = require("../models/user-rooms.js");

const updateMessages = async (req, res) => {
  const room = await Rooms.findById(req.params.id);
  const user = await Users.findById(req.user.id);
  const { messages } = req.body;

  if (!room) return res.status(403).json({ message: "no room found" });

  const authorized =
    user._id.equals(room.user_id_1) || user._id.equals(room.user_id_2);

  if (!authorized) {
    return res.status(403).json({ message: "user not authorized" });
  }
  const updatedMessages = {
    $push: {
      messages: {
        $each: messages.map((message) => ({
          user_id: req.user.id,
          body: message.body,
        })),
      },
    },
  };

  const response = await Rooms.findByIdAndUpdate(room._id, updatedMessages);
  res.status(200).json({ messages: response });
};

const messageRead = async (req, res) => {
  try {
    const room = await Rooms.findById(req.params.id);
    const roomId = req.params.id;
    const user = req.user;
  
    if (!room) return res.status(405).json({ message: "no room found" });
  
    const authorized = user._id.equals(room.user_id_1) || user._id.equals(room.user_id_2);
  
    const secondUserId = user._id.equals(room.user_id_1) ? room.user_id_2 : room.user_id_1
  
    if (!authorized) {
      return res.status(403).json({ message: "user not authorized" });
    }
  
    const roomUpdatePromise = await Rooms.findOneAndUpdate(
      { _id: roomId, 'messages.user_id': secondUserId, 'messages.read': false },
      { $set: { 'messages.$[elem].read': true } },
      { new: true, arrayFilters: [{ 'elem.user_id': secondUserId }] }
    );
  
    if (!roomUpdatePromise) {
      return res.status(203).json({ message: "Room not found or user not authorized" });
    }

    const updatedMessages = roomUpdatePromise.messages;
  
    res.status(200).json({ messages: updatedMessages });
  } catch (err) { console.error(err);} 
  
};
const unreadMessages = async (req, res) => {
  const room = await Rooms.findById(req.params.id);
  const user = req.user;

  if (!room) return res.status(403).json({ message: "no room found" });

  const authorized =
    user._id.equals(room.user_id_1) || user._id.equals(room.user_id_2);

  if (!authorized) {
    return res.status(403).json({ message: "user not authorized" });
  }
 
  const roomUpdatePromise = await Rooms.findOneAndUpdate(
    { _id: room._id, 'messages.user_id': user._id },
    { $set: { 'messages.$[].read': false } },
    { new: true }
  );

  const updatedMessages = roomUpdatePromise.messages;

  res.status(200).json({ messages: updatedMessages });
  
};


const createRoom = async (req, res) => {
  try {
    const { user_id_1, user_id_2 } = req.body;
    const user = await Users.findOne({ _id: req.user.id });

    if (!user_id_1 || !user_id_2) {
      return res
        .status(400)
        .json({ message: "Didn't get user_1 or user_2 id" });
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

    if(existingRoom){
      return res.status(200).json({ message: "Room already exists", room: existingRoom});
    }

    if (!existingRoom) {
      const newRoom = {
        user_id_1: user_id_1,
        user_id_2: user_id_2,
        messages: [],
      };

      const response = await Rooms.create(newRoom);

      if (response) {
        return res
          .status(201)
          .json({ message: "Room created successfully", room: response, userRooms: user.rooms });
      }
    } else {
      return res.status(203).json({ message: "Room already exists" });
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
  unreadMessages
};
