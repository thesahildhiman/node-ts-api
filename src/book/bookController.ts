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
    return next(createHttpError(500, "internal server error"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const { bookId } = req.params;
  try {
    // find book in db
    const book = await bookModel.findById(bookId);

    if (!book) {
      return next(createHttpError(404, "book not found"));
    }

    const _req = req as AuthRequest;
    // check book access
    if (book.author.toString() !== _req.userId) {
      // toString converts ObjectId('') to string
      return next(createHttpError(403, "you can't update others book"));
    }

    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    // check if image field exist
    let completeCoverImage = null;
    if (files.coverImage) {
      const fileName = files.coverImage[0].filename;
      const filePath = path.resolve(
        __dirname,
        "../../public/uploads",
        fileName
      );
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

      completeCoverImage = fileName;
      // cover image upload
      const coverUploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverImageMimeType,
      });

      completeCoverImage = coverUploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    let completeFileName = null;
    // check if pdf file field exist
    if (files.file) {
      // book pdf file upload
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/uploads",
        bookFileName
      );
      const bookMimeType = files.file[0].mimetype.split("/").at(-1);

      completeFileName = bookFileName;
      const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw", // not needed for image/videos
        filename_override: completeFileName,
        folder: "book-pdfs",
        format: bookMimeType,
      });

      completeFileName = bookUploadResult.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
    );

    return res
      .status(201)
      .json({ updatedBook, messgae: "updated book successfully" });
  } catch (err) {
    return next(createHttpError(500, "internal server error"));
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    return res.status(200).json({ books });
  } catch (error) {
    return next(createHttpError(500, "error in getting book listing"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;

  try {
    const book = await bookModel.findById(bookId);

    if (!book) {
      return next(createHttpError(404, "book not found"));
    }

    return res.status(200).json({ book });
  } catch (error) {
    return next(createHttpError(500, "error while getting book"));
  }
};

export { createBook, updateBook, listBooks, getSingleBook };
