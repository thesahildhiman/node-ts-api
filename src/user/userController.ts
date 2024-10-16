import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //   validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "all fields are required");
    return next(error);
  }

  //   check if user already exist
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "user already exist");
    return next(error);
  }

  //    hashed password
  const hashPassword = await bcrypt.hash(password, 10);

  //   create record in db
  const newUser = await userModel.create({
    name,
    password: hashPassword,
    email,
  });

  //   generate token
  const token = sign({ sub: newUser._id }, config.SECRET as string, {
    expiresIn: "7d",
  });
  //   send response
  return res.status(201).json({ token });
};

export { createUser };
