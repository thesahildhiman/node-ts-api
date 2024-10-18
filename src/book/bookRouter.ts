import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "path";

const bookRouter = express.Router();

// file store local - middleware
const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads"),
  limits: { fileSize: 3e7 },
});

// routes
bookRouter.post(
  "/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook as any
);

export default bookRouter;
// upload.single() - used to upload single file
// upload.fields() - used to array of files in multipart/form data
// multer first of all stores uploaded files locally and then auto delete these files
