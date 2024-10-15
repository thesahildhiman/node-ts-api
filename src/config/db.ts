import mongoose, { mongo } from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    // 1.registering events
    // events executed after mongo connection
    mongoose.connection.on("connected", () => {
      // executed after successfull connection
      console.log("mongodb connected");
    });

    // event triggered if any error occured in-between connection
    mongoose.connection.on("error", (err) => {
      console.log("error in mongodb connection", err);
    });

    // 2. call for mongodb connection
    await mongoose.connect(config.DB_URL as string);
  } catch (error) {
    console.error("mongo err- ", error);
    process.exit(1); // if connection fails then we dont want to proceed further operations ( like server running)
  }
};

export default connectDB;
