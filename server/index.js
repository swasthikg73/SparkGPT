import express from "express";
import cors from "cors";
//Read env file
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./configs/db.config.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRoute.js";
import messageRouter from "./routes/messageRoute.js";
import creditRouter from "./routes/creditRouter.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

const PORT = process.env.PORT || 3000;
const app = express();

await connectDB();

//Stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.get("", (req, res) => {
  res.send(`<h1>Server is Up</h1>`);
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

app.listen(PORT, () => {
  console.log("App is running on http://localhost:" + PORT);
});
