import express from "express";
import { createBook } from "./bookController";

const bookRouter = express.Router();

// routes
bookRouter.post("/create", createBook as any);

export default bookRouter;
