import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.files);
  const files = req.files as { [fieldName: string]: Express.Multer.File[] };

  try {
    // book cover image upload
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, "../../public/uploads", fileName);
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    console.log("---upload-----", uploadResult);

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
    return res.status(201).json({ messgae: "created book" });
  } catch (err) {
    return next(createHttpError(500, "error during file upload"));
  }
};

export { createBook };
