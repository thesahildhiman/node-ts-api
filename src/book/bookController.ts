import { NextFunction, Request, Response } from "express";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(201).json({ messgae: "created book" });
};

export { createBook };