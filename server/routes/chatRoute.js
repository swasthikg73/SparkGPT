import express from "express";

import { protect } from "../middlewares/auth.js";
import {
  createChat,
  deleteAllChats,
  deleteChat,
  getAllChats,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/create", protect, createChat);
chatRouter.delete("/delete", protect, deleteChat);
chatRouter.get("/get", protect, getAllChats);

chatRouter.get("/all", deleteAllChats);
export default chatRouter;
