import imagekit from "../configs/imagekit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import axios from "axios";
import User from "../models/User.js";

//Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You dont't have enough credits to use this feature",
      });
    }
    const chat = await Chat.findOne({ userId, _id: chatId });

    // console.log(chat);
    await chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });
    // console.log(chat);

    const choices = await openai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    var message = choices.text;
    const reply = {
      content: message,
      role: "assistant",
      timestamp: Date.now(),
      isImage: false,
    };

    // console.log(reply);

    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.json({ success: true, reply });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to generate Image
export const imageController = async (req, res) => {
  try {
    const userId = req.user._id;

    //Check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You dont't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    //Find Chat
    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: true,
    });

    //Encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);

    //Construct Imagekit AI genertion URL
    const generatedImageUrl = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt-
    ${encodedPrompt}/SparkGPT/${Date.now()}.png?tr=w-800,h-800`;

    //Trigger image generation by fetching from imagekit
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    //Upload/Store generated image to Imagekit
    const uploadResponse = await imagekit.upload({
      file: aiImageResponse.data,
      fileName: `${Date.now()}.png`,
      folder: "SparkGPT",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    return res.json({ success: true, reply });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
