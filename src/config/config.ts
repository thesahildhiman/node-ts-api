import { config as dotenv } from "dotenv";
dotenv();

const _config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_URI,
  SECRET: process.env.SECRET,
  API_KEY: "",
};

export const config = Object.freeze(_config); // freeze make the object read-only, so it is not modified
