import { config as dotenv } from "dotenv";
dotenv();

const _config = {
  PORT: process.env.PORT,
  API_KEY: "",
};

export const config = Object.freeze(_config); // freeze make the object read-only, so it is not modified
