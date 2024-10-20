import express, { NextFunction, Request, Response } from "express";
import {
  createBook,
  getSingleBook,
  listBooks,
  updateBook,
} from "./bookController";
import multer from "multer";
import path from "path";
import createHttpError from "http-errors";
import auth from "../middleware/auth";

const bookRouter = express.Router();

// file store local - middleware
const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads"),
  limits: { fileSize: 5e5 },
});

// fileupload middleware
const uploadMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ])(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors, including file size
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(createHttpError(400, " file size is too large"));
      }
      // Handle other Multer errors
      return next(createHttpError(400, err.message));
    } else if (err) {
      // Handle unknown errors
      return next(createHttpError(500, "error occurred during file upload"));
    }

    // If no error, proceed to the next middleware (createBook controller)
    next();
  });
};

// routes
bookRouter.post(
  "/create",
  //   can be use this directly instead of uploadMiddleware
  //   upload.fields([
  //     { name: "coverImage", maxCount: 1 },
  //     { name: "file", maxCount: 1 },
  //   ]),
  auth,
  uploadMiddleware,
  createBook as any
);

bookRouter.put("/update/:id", auth, updateBook as any);

bookRouter.get("/", auth, listBooks as any);

bookRouter.get("/bookId", auth, getSingleBook as any);

export default bookRouter;
// upload.single() - used to upload single file
// upload.fields() - used to array of files in multipart/form data
// multer first of all stores uploaded files locally and then we need to delete these files using fs module
