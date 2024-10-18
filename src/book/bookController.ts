import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middleware/auth";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fieldName: string]: Express.Multer.File[] };

  try {
    // book cover image upload
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, "../../public/uploads", fileName);
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const coverUploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // book pdf file upload
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/uploads",
      bookFileName
    );
    const bookMimeType = files.file[0].mimetype.split("/").at(-1);

    const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw", // not needed for image/videos
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: bookMimeType,
    });
    console.log("---pdf upload---", bookUploadResult);

    const _req = req as AuthRequest;
    // save book in db
    const newBook = await bookModel.create({
      title,
      genre,
      file: bookUploadResult.secure_url,
      coverImage: coverUploadResult.secure_url,
      author: _req.userId,
    });

    try {
      // delete files from public folder after upload
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (err) {
      return next(createHttpError(500, "error during uploaded file delete"));
    }

    return res
      .status(201)
      .json({ bookId: newBook?._id, messgae: "created book" });
  } catch (err) {
    return next(createHttpError(500, "error during file upload"));
  }
};

export { createBook };
