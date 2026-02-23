import imagekit from "../configs/imagekit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Groq from "groq-sdk";

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

    // const ai = new GoogleGenAI({
    //   apiKey: process.env.GEMINI_API_KEY,
    // });

    const groundingTool = {
      googleSearch: {},
    };
    // const choices = await ai.models.generateContent({
    //   model: "gemini-2.0-flash-lite",
    //   contents: prompt,
    //   // config: {
    //   //   tools: [groundingTool],
    //   // },
    // });

    // const client = new OpenAI();
    // const choices = await client.responses.create({
    //   model: "gpt-3.5-turbo",
    //   input: prompt,
    // });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // const chatCompletion = await getGroqChatCompletion();
    // // Print the completion returned by the LLM.
    // console.log(chatCompletion.choices[0]?.message?.content || "");

    // const { choices } = await groq.chat.completions.create({
    //   messages: [
    //     {
    //       role: "user",
    //       content: prompt,
    //       config: {
    //         tools: [groundingTool],
    //       },
    //     },
    //   ],
    //   model: "openai/gpt-oss-20b",
    // });

    // Step 1: Get live search results

    async function getLatestAnswer(prompt) {
      // 🔎 Step 1: Fetch latest search results
      const search = await axios.post("https://api.tavily.com/search", {
        api_key: process.env.TAVILY_API_KEY,
        query: prompt,
        search_depth: "basic",
      });

      // ✅ Properly format results
      const results = search.data.results
        .map((r) => `Title: ${r.title}\nContent: ${r.content}`)
        .join("\n\n");

      // 🤖 Step 2: Send grounded context to Groq
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: "Answer strictly using the search results provided.",
          },
          {
            role: "user",
            content: `
Search Results:
${results}

Question:
${prompt}
        `,
          },
        ],
      });

      const responseText = completion.choices[0].message.content;

      return responseText;
    }

    const responseData = await getLatestAnswer(prompt);

    var message = responseData;
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
    console.log(error);
    return res.json({
      success: false,
      message: "Sorry..something went wrong!",
    });
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
    const generatedImageUrl =
      process.env.IMAGEKIT_URL_ENDPOINT +
      `/ik-genimg-prompt-${encodedPrompt}/SparkGPT/${Date.now()}.png?tr=w-800,h-800`;

    //Trigger image generation by fetching from imagekit
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    const contentType = aiImageResponse.headers["content-type"];

    if (!contentType || !contentType.startsWith("image/")) {
      console.error("ImageKit response is not an image");
      console.error(aiImageResponse.data.toString());
      throw new Error("Image generation failed");
    }

    //  Upload/Store generated image to Imagekit
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
    return res.json({ success: false, message: "Sorry..something went wrong" });
  }
};
