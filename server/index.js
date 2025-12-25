import express from "express";
import cors from "cors";
import connectDB from "./configs/db.config.js";
import userRouter from "./routes/userRouter.js";

//Read env file
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

await connectDB();

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.get("", (req, res) => {
  res.send(`<h1>Server is Up</h1>`);
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log("App is running on http://localhost:" + PORT);
});
