import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  imageController,
  textMessageController,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/text", protect, textMessageController);
messageRouter.post("/image", protect, imageController);

export default messageRouter;
