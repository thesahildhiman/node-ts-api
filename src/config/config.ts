import { config as dotenv } from "dotenv";
dotenv();

const _config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_URI,
  SECRET: process.env.SECRET,
  CLOUDINARY_CLOUD: process.env.CLOUDINARY_CLOUD,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config); // freeze make the object read-only, so it is not modified
