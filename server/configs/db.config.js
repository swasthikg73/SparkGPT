import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB is Connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/SparkGPT`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
