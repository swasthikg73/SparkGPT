import Chat from "../models/Chat.js";

//API controller for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };

    await Chat.create(chatData);
    return res.json({ sucess: true, message: "Chat created" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//API controller for getting all chats

export const getAllChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return res.json({ success: true, chats });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//API controller for deleteng a chat

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    await Chat.deleteOne({ _id: chatId });
    return res.json({ success: true, message: "Chat deleted" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteAllChats = async (req, res) => {
  try {
    let result = await Chat.deleteMany({});
    return res.json({ success: true, message: "Chat deleted" });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};
