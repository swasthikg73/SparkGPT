import express from "express";

import { protect } from "../middlewares/auth.js";
import {
  createChat,
  deleteChat,
  getAllChats,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/create", protect, createChat);
chatRouter.delete("/delete", protect, deleteChat);
chatRouter.get("/get", protect, getAllChats);

export default chatRouter;
